import type { IRssReadingList } from "server/src/models/RssReadingList";
import type { RSSData } from "./newsTypes";

export type RSSGetParams = {
  option: "reddit" | "cnet" | "medium" | "all";
};
export type ResponseSource = "reddit" | "medium" | "cnet" | "all";

export type RSSQueryParams = {
  redditOpts?: {
    filter?: "new" | "hot" | "top";
    subreddit?: "technology" | "apple" | "windows" | "mobile" | "realtech" | "tech";
    limit?: number;
    skip?: number;
  };
  mediumOpts?: {
    topic?: string;
    user?: string;
  };
};

export type RssRequestRes = {
  responseMsg: string;
  source: ResponseSource;
  title: string;
  logoURL: string;
  rssFeed: RSSData[];
}
export type GetReadingListRes = {
  responseMsg: string;
  readingListModel: IRssReadingList;
};
export type ReadingListAddRes = {
  responseMsg: string;
  rssData: RSSData;
};
export type ReadingListRemoveRes = {
  responseMsg: string;
  rssDataId: string;
};
