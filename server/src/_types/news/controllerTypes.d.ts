import type { IRssReadingList } from "server/src/models/RssReadingList";
import type { RSSData } from "./newsTypes";

export type RSSGetParams = {
  option: "reddit" | "cnet" | "medium" | "all";
};
export type ResponseSource = "reddit" | "medium" | "cnet" | "all";

export type RSSQueryParams = {
  filter?: "new" | "hot" | "top";
  subreddit?: "technology" | "apple" | "windows" | "mobile" | "realtech" | "tech";
  topic?: string;
  user?: string;
  limit?: number;
  skip?: number;
  before?: string;
  after?: string;
};

export type RssRequestRes = {
  responseMsg: string;
  source: ResponseSource;
  title: string;
  lastItemId: string;
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
