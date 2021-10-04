export interface IRSSState {
  status: null | number;
  loading: boolean;
  responseMsg: string;
  source: RSSSources | "";
  logoURL: string;
  title: string;
  rssFeed: RSSData[]; // we should normalize the data later //
  error: any | null;
  errorMessages: string[] | null;
};

export type RSSSources = "reddit" | "medium" | "cnet" | "all";

export type RSSData = {
  author: { username?: string; uri?: string };
  thumbnailPreviewURI?: string;
  articleLink: string;
  category: string[];
  provider: RSSSources | string;
  author?: string;
  title: string;
  published: string;
  updated: string;
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
};

