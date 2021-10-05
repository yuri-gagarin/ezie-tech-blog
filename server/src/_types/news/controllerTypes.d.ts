import type { IRssReadingList } from "server/src/models/RssReadingList";
import type { RSSData } from "./newsTypes";

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
};

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
