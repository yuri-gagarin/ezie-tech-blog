import RssReadingList from "server/src/models/RssReadingList";

export interface IRSSState {
  status: null | number;
  loading: boolean;
  responseMsg: string;
  source: RSSSources | "";
  logoURL: string;
  title: string;
  lastItemId: string;
  currentPage: number;
  rssFeed: RSSData[]; // we should normalize the data later //
  readingList: RSSData[];
  error: any | null;
  errorMessages: string[] | null;
};

export type RSSSources = "reddit" | "medium" | "cnet" | "all";

export type RSSData = {
  _id: string; // for saved feeds //
  author: { username: string; uri: string };
  thumbnailPreviewURI: string;
  articleLink: string;
  category: string[];
  provider: RSSSources | string;
  author?: string;
  title: string;
  published: string;
  updated: string;
};

export type RssReadingListData = {
  _id: string;
  userId: string;
  items: RSSData[];
  createdAt: string;
  editedAt: string;
}

export type FetchRSSOptions = {
  option: RSSSources;
  redditOpts?: {
    filter?: "new" | "hot" | "top";
    subreddit?: "technology" | "apple" | "windows" | "mobile" | "realtech" | "tech";
  };
  mediumOpts?: {
    topic?: string;
    user?: string;
  };
  cnetOpts?: {
    topic?: string;
  }
  getOpts?: {
    limit?: number;
    skip?: number;
    before?: string;
    after?: string;
  }
  currentPage?: number;
};

// response types //
export type GetRSSRes = {
  responseMsg: string;
  source: RSSSources;
  title: string;
  lastItemId: string;
  logoURL: string;
  rssFeed: RSSData[];
};

export type AddToReaderRes = {
  responseMsg: string;
  rssData: RSSData;
};
export type RemoveFromReaderRes = {
  responseMsg: string;
  rssDataId: string;
};
export type GetReadingListRes = {
  responseMsg: string;
  readingListModel: RssReadingListData;
};


