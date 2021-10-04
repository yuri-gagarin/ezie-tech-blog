export interface IRSSState {
  status: null | number;
  loading: boolean;
  responseMsg: string;
  source: "reddit" | "medium" | "cnet" | "all" | "";
  logoURL: string;
  title: string;
  rssFeed: RSSData[]; // we should normalize the data later //
  error: any | null;
  errorMessages: string[] | null;
};

export type RSSData = {
  author: { username?: string; uri?: string };
  thumbnailPreviewURI?: string;
  articleLink: string;
  title: string;
  published: string;
  updated: string;
}


export type FetchRSSOptions = {
  option: "reddit" | "cnet" | "medium"; // add more as needed //
  redditOpts?: {
    filter?: "new" | "hot" | "top";
    subreddit?: "technology" | "apple" | "windows" | "mobile" | "realtech" | "tech";
  };
  mediumOpts?: {
    topic?: string;
    user?: string;
  };
};

