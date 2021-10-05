import type { RSSData } from "./dataTypes";

export type RSSAPIRequest = {
  type: "RSSAPIRequest";
  payload: {
    loading: boolean;
    error: null;
    errorMessages: null;
  };
};
export type FetchRSSFeed = {
  type: "FetchRSSFeed";
  payload: {
    responseMsg: string;
    status: number;
    loading: boolean;
    rssFeed: RSSData[];
    source: "reddit" | "medium" | "cnet" | "all";
    logoURL: string;
    title: string;
    error: null;
    errorMessages: null;
  };
};
export type AddRSSToReadingList = {
  type: "AddRSStoReadingList";
  payload: {
    readingList: RSSData[]; error: null; errorMessages: null;
  };
};
export type RemoveRSSFromReadingList = {
  type: "RemoveRSSFromReadingList";
  payload: {
    readingList: RSSData[]; error: null; errorMessages: null;
  };
};
export type SetRSSFeedError = {
  type: "SetRSSFeedError";
  payload: {
    responseMsg: string;
    status: number;
    loading: boolean;
    error: any;
    errorMessages: string[];
  };
};
export type ClearRSSFeedError = {
  type: "ClearRSSFeedError";
  payload: {
    errror: null;
    errorMessages: null;
  };
};

export type RSSAction = (
  RSSAPIRequest | FetchRSSFeed | SetRSSFeedError | AddRSSToReadingList | RemoveRSSFromReadingList | ClearRSSFeedError
);