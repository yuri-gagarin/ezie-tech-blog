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
    rssFeed: any[];
    error: null;
    errorMessages: null;
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
  RSSAPIRequest | FetchRSSFeed | SetRSSFeedError | ClearRSSFeedError
);