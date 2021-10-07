import { Types } from "mongoose";
import { parse } from 'node-html-parser';
// type imports //
import type { RSSData } from "../../_types/news/newsTypes";
import type { ResponseSource } from "../../_types/news/controllerTypes";

export type RSSNormalizedRes = {
  source: ResponseSource; 
  title: string; 
  lastItemId: string;
  logoURL: string; 
  rssFeed: RSSData[];
};

export const parseRedditRSSObj = (rssObj: any): RSSNormalizedRes => {
  const entries: RSSData[] = [];
  const foundEntries: any[] = rssObj.feed.entry;
  const title = rssObj.feed.title[0];
  const logoURL = rssObj.feed.logo[0];
  //
  const lastItemId: string = foundEntries[foundEntries.length - 1].id[0] || "";
  for (const entry of foundEntries) {
    const contentObj = parse(entry.content[0]['_']);
    const data: RSSData = {
      _id: new Types.ObjectId(),
      author: {
        username: entry.author[0].name[0],
        uri: entry.author[0].uri[0]
      },
      provider: "reddit",
      thumbnailPreviewURI: entry["media:thumbnail"] ? entry["media:thumbnail"][0].$.url : "",
      articleLink: contentObj.querySelectorAll("a")[2].rawAttributes.href,
      title: entry.title[0],
      category: ["technology"],
      published: entry.published[0],
      updated: entry.updated[0]
    };
    entries.push(data);
  }
  return { source: "reddit", title, logoURL, lastItemId, rssFeed: entries };
};

export const parseMediumRSSObj = (rssObj: any): RSSNormalizedRes => {
  const rssFeed: RSSData[] = [];
  const data = rssObj.rss.channel[0];
  const title: string = data.title[0];
  const logoURL: string = data.image[0].url[0];
  for (const entry of data.item) {
    const data: RSSData = {
      _id: new Types.ObjectId(),
      author: {
        username: entry["dc:creator"] && Array.isArray(entry["dc:creator"]) ? entry["dc:creator"][0] : "Medium Author",
        uri: "",
      },
      provider: "medium",
      thumbnailPreviewURI: logoURL,
      articleLink: entry.link[0],
      title: entry.title[0],
      category: entry.category && Array.isArray(entry.category) ? entry.category : [ "technology" ],
      published: entry.pubDate[0],
      updated: entry.pubDate[0]
    };
    rssFeed.push(data);
  }
  return { source: "medium", title, logoURL, lastItemId: "", rssFeed };
};
export const parseCnetRSSObj = (rssObj: any): RSSNormalizedRes => {
  const rssFeed: RSSData[] = [];
  const data = rssObj.rss.channel[0];
  const title: string = data.title[0];
  const logoURL: string = data.image[0].url[0];
  for (const entry of data.item) {
    const data: RSSData = {
      _id: new Types.ObjectId(),
      author: {
        username: entry["dc:creator"] && Array.isArray(entry["dc:creator"]) ? entry["dc:creator"][0] : "Cnet Author",
        uri: ""
      },
      provider: "cnet",
      thumbnailPreviewURI: entry["media:thumbnail"] &&  Array.isArray( entry["media:thumbnail"]) ? entry["media:thumbnail"][0].$.url : logoURL,
      articleLink: entry.link[0],
      title: entry.title[0],
      category: [ "Technology" ],
      published: entry.pubDate[0],
      updated: entry.pubDate[0]
    };
    rssFeed.push(data);
  }
  return { source: "cnet", title, logoURL, lastItemId: "", rssFeed };
};

export const parseRSSResponse = ({ rssObj, source }: { rssObj: any; source: ResponseSource }): RSSNormalizedRes => {
  switch (source) {
    case "reddit": {
      return parseRedditRSSObj(rssObj);
    }
    case "medium": {
      return parseMediumRSSObj(rssObj);
    }
    case "cnet": {
      return parseCnetRSSObj(rssObj);
    }
    default: {
      return { source: "all", title: "title", logoURL: "logo", lastItemId: "", rssFeed: [] };
    }
  }
};
