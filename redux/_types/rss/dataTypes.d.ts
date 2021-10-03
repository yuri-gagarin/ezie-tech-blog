export interface IRssState {
  status: null | number;
  loading: boolean;
  responseMsg: string;
  rssFeed: any[]; // we should normalize the data later //
  error: any | null;
  errorMessages: string[] | null;
};

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

