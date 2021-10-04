import type { RSSAction } from "../_types/rss/actionTypes";
import type { IRSSState } from "../_types/rss/dataTypes";

const initialState: IRSSState = {
  status: null,
  loading: false,
  responseMsg: "",
  source: "",
  logoURL: "",
  title: "",
  rssFeed:[],
  error: null,
  errorMessages: null
};

export default function RSSReducer(state: IRSSState = initialState, action: RSSAction): IRSSState {
  switch(action.type) {
    case "RSSAPIRequest": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "FetchRSSFeed": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "SetRSSFeedError": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "ClearRSSFeedError": {
      return {
        ...state,
        ...action.payload
      };
    }
    default: return state;
  }
};

