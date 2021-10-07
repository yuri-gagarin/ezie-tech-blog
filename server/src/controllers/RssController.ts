import { Types } from "mongoose";
import { parseStringPromise } from "xml2js";
// models and extenstions //
import RssReadingList, { IRssReadingList } from "../models/RssReadingList";
import { BasicController } from "../_types/abstracts/DefaultController";
// type imports //
import type { Request, Response } from "express";
import type { GenUserData } from "@/redux/_types/users/dataTypes";
import type { ClientRSSData, RSSData } from "../_types/news/newsTypes";
import type { 
  RSSGetParams, RSSQueryParams, ResponseSource, 
  RssRequestRes, GetReadingListRes, ReadingListAddRes, ReadingListRemoveRes 
} from "../_types/news/controllerTypes";
// helpers //
import { parseRSSResponse } from "./_helpers/dataHelpers";

export class RssController extends BasicController {
  handleRssRequest = async (req: Request, res: Response<RssRequestRes>): Promise<Response> => {
    const { option }: RSSGetParams = req.params as RSSGetParams;
    const { filter = "hot", subreddit = "technology", topic = "tech", user = null, skip = 0, before, after } = req.query as RSSQueryParams;
    let url: string;
    let redditPageOpts: string;
    let responseSource: ResponseSource;

    switch (option) {
      case "reddit": {
        const baseURL = "http://www.reddit.com/r";
        if (after) redditPageOpts = `&after=${after}`;
        if (before) redditPageOpts = `&before=${before}`;
        url = `${baseURL}/${subreddit}/${filter}/.rss?limit=${10}${redditPageOpts || ""}`;
        responseSource = "reddit";
        break;
      }
      case "medium": {
        const baseURL = "https://www.medium.com/feed";
        if (user) url = `${baseURL}/@${user}`;
        else url = `${baseURL}/tag/${topic}?limit=10`;
        responseSource = "medium";
        break;
      }
      case "cnet": {
        url = "https://www.cnet.com/rss/news?limit=10";
        responseSource = "cnet";
        break;
      }
      default: {
       return await this.userInputErrorResponse(res, [ "Could not resolve RSS feed source" ]);
      }
    }
    try {
      const response = await fetch(url);
      const rssObj = await parseStringPromise(await response.text());
      const { source, title, logoURL, lastItemId, rssFeed } = parseRSSResponse({ rssObj, source: option });
      return res.status(200).json({
        responseMsg: "RSS feed success", source, title, logoURL, lastItemId, rssFeed
      })
    } catch (error) {
      console.log("rss error");
      console.log(error)
      return await this.generalErrorResponse(res, { error, errorMessages: [ "Rss GET error" ] });
    }
  }

  handleGetReadingList = async (req: Request, res: Response<GetReadingListRes>): Promise<Response> => {
    const user = req.user as GenUserData;
    
    if (!user) return await this.notAllowedErrorResponse(res, [ "Could not resolve the user" ]);

    try {
      const { _id: userId } = user;
      const readingListModel: IRssReadingList | null = await RssReadingList.findOne({ userId }).exec();
      return res.status(200).json({
        responseMsg: "Reading list response", readingListModel
      });
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }

  handleAddToReadingList = async (req: Request, res: Response<ReadingListAddRes>): Promise<Response> => {
    const user = req.user as GenUserData;
    const rssData = req.body.rssData as ClientRSSData;

    if (!user) return this.notAllowedErrorResponse(res, [ "Could not resolve user data" ]);
    if (!rssData) return this.userInputErrorResponse(res, [ "Could not resolve reading list item to save" ]);

    try {
      const { _id: userId } = user;
      const normalizedData: RSSData = this.normalizeReaderRssOb(rssData);
      const updatedRssReadingList = await RssReadingList.findOneAndUpdate(
        { userId }, { $push: { items: normalizedData } }, { upsert: true, new: true }
      ).exec();

      if (updatedRssReadingList) {
        return res.status(200).json({
          responseMsg: "Added to reading list", rssData: normalizedData
        });
      } else {
        return this.generalErrorResponse(res, { errorMessages: [ "Could not resolve a reading list model" ] });
      }
    } catch (error) {
      console.log(error)
      return await this.generalErrorResponse(res, { error });
    }
  }
  handleRemoveFromReadingList = async (req: Request, res: Response<ReadingListRemoveRes>): Promise<Response> => {
    const user = req.user as GenUserData;
    const { rssDataId } = req.body;

    if (!user) return this.notAllowedErrorResponse(res, [ "Could not resolve user data" ]);
    if (!rssDataId) return this.userInputErrorResponse(res, [ "Could not resolve reading list item to remove" ]);

    try {
      const { _id: userId } = user;
      const updatedRssReadingList = await RssReadingList.findOneAndUpdate(
        { userId }, { $pull: { items: { _id: rssDataId } } }, { new: true }
      ).exec()
      if (updatedRssReadingList) {
        return res.status(200).json({
          responseMsg: "Removed from reading list", rssDataId
        });
      } else {
        return this.generalErrorResponse(res, { errorMessages: [ "Could not resolve a reading list model" ] });
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }

  private getAllRssSources() {
    const rssSources = {
      reddit: "http://www.reddit.com/r",
      cnet: "https://www.cnet.com/rss/news/",
      medium: "https://www.medium.com/feed"
    };
  }
  private getRssUrl({ key }: { key: ResponseSource}): string {
    const rssSources = {
      reddit: "http://www.reddit.com/r",
      cnet: "https://www.cnet.com/rss/news/",
      medium: "https://www.medium.com/feed"
    };
    return rssSources[key];
  }
  private normalizeReaderRssOb(data: ClientRSSData): RSSData {
    const normalized: RSSData = {
      _id: data._id ? new Types.ObjectId(data._id) : new Types.ObjectId(),
      author: { 
        username: data.author && data.author.username || "Anonymous",
        uri: data.author && data.author.uri || ""
      },
      thumbnailPreviewURI: data.thumbnailPreviewURI || "",
      articleLink: data.articleLink || "",
      category: data.category || [],
      provider: data.provider || "",
      title: data.title || "",
      published: data.published || "",
      updated: data.updated || ""
    };
    return normalized;
  }
}