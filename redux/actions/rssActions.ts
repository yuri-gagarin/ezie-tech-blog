import axios from "axios";
import { parseStringPromise } from "xml2js";
// types //
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Dispatch } from "redux";
import type { FetchRSSFeed, RSSAction, SetRSSFeedError, ClearRSSFeedError } from "@/redux/_types/rss/actionTypes";
import type { FetchRSSOptions } from "@/redux/_types/rss/dataTypes";
// helpers //
import { processAxiosError } from "../_helpers/dataHelpers";
import { parseRSSResponse } from "../_helpers/rssHelpers";

class RSSReduxActions {

  async getRSSFeed({ dispatch, optsData }: { dispatch: Dispatch<RSSAction>; optsData: FetchRSSOptions }): Promise<FetchRSSFeed>  {
    const { option, redditOpts, mediumOpts } = optsData;
    const reqOpts: AxiosRequestConfig = {
      method: "GET",
      url: `/api/rss/${option}`,
      params: {
        redditOpts: redditOpts ? redditOpts : null,
        mediumOpts: mediumOpts ? mediumOpts : null
      }
    }
    dispatch({ type: "RSSAPIRequest", payload: { loading: true, error: null, errorMessages: null } });
    try {
      const { status, statusText: responseMsg, data }: AxiosResponse<any> = await axios(reqOpts);

      const rssObj = await parseStringPromise(data);
      const { source, title, logoURL, rssFeed, } = parseRSSResponse({ rssObj, source: option });
      return dispatch({ 
        type: "FetchRSSFeed",  
        payload: { status, responseMsg, source, title, logoURL, rssFeed, error: null, errorMessages: null, loading: false }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  } 

  handleRssFeedError(err: any, dispatch: Dispatch<RSSAction>): SetRSSFeedError {
    const { responseMsg, status, error, errorMessages } = processAxiosError(err);
    return dispatch({ 
      type: "SetRSSFeedError", 
      payload: { status, responseMsg, error, errorMessages, loading: false } 
    });
  };
  handleDismissRssFeedError({ dispatch }: { dispatch: Dispatch<RSSAction>; }): ClearRSSFeedError {
    return dispatch({ type: "ClearRSSFeedError", payload: { errror: null, errorMessages: null } });
  }
};

export const RssActions = new RSSReduxActions();