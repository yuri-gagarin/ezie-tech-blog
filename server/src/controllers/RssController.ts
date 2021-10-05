import { Types } from "mongoose";
import RssReadingList from "../models/RssReadingList";
import { BasicController } from "../_types/abstracts/DefaultController";
// type imports //
import type { Request, Response } from "express";
import type { GenUserData } from "@/redux/_types/users/dataTypes";
import type { ClientRSSData, RSSData } from "../_types/news/newsTypes";

export type RSSGetParams = {
  option: "reddit" | "cnet" | "medium" | "all";
};
export type ResponseSource = "reddit" | "medium" | "cnet";
export type RSSQueryParams = {
  redditOpts?: {
    filter?: "new" | "hot" | "top";
    subreddit?: "technology" | "apple" | "windows" | "mobile" | "realtech" | "tech";
  };
  mediumOpts?: {
    topic?: string;
    user?: string;
  };
}
export class RssController extends BasicController {
  handleRssRequest = async (req: Request, res: Response) => {
    const { option }: RSSGetParams = req.params as RSSGetParams;
    const { redditOpts, mediumOpts } = req.query as RSSQueryParams;
    let url: string;
    let responseSource: ResponseSource;
    let rssText: string;
    switch (option) {
      case "reddit": {
        const baseURL = "http://www.reddit.com/r";
        const { subreddit = "technology", filter = "hot" } = redditOpts ? redditOpts : {};
        url = `${baseURL}/${subreddit}/${filter}/.rss`;
        responseSource = "reddit";
        break;
      }
      case "medium": {
        const baseURL = "https://www.medium.com/feed";
        const { topic = "tech", user = null } = mediumOpts ? mediumOpts : {};
        if (user) url = `${baseURL}/@${user}`;
        else url = `${baseURL}/tag/${topic}`;
        responseSource = "medium";
        break;
      }
      case "cnet": {
        url = "https://www.cnet.com/rss/news/";
        responseSource = "cnet";
        break;
      }
      default: {
        return res.status(500).json({
          responseMsg: "Error",
          error: new Error("RSS feed error"),
          errorMessages: [ "Could not resolve RSS feed" ]
        })
      }
    }
    try {
      const response = await fetch(url);
      const text = await response.text();
      res.setHeader("Content-Type", "application/rss-xml");
      res.send(text);
    } catch (error) {
      console.log("rss error");
      console.log(error)
      return res.status(500).json({
        responseMsg: "Error",
        error: new Error("RSS feed error"),
        errorMessages: [ "Could not resolve RSS feed" ]
      });
    }
  }

  handleAddToReadingList = async (req: Request, res: Response): Promise<Response> => {
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
  handleRemoveFromReadingList = async (req: Request, res: Response): Promise<Response> => {
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
      _id: new Types.ObjectId(),
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