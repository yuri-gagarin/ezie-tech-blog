import axios from "axios";
import { parseStringPromise } from "xml2js";
// types //
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Dispatch } from "redux";
import type { FetchRSSFeed, RSSAction, SetRSSFeedError } from "@/redux/_types/rss/actionTypes";
import type { FetchRSSOptions } from "@/redux/_types/rss/dataTypes";
// helpers //
import { processAxiosError } from "../_helpers/dataHelpers";

class RSSReduxActions {

  async getRSSFeed({ dispatch, optsData }: { dispatch: Dispatch<RSSAction>; optsData: FetchRSSOptions }): Promise<any>  {
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
      const { status, data }: AxiosResponse<any> = await axios(reqOpts);
      const rssObj = await parseStringPromise(data);
      console.log(rssObj);
    } catch (error) {
      console.log(error);
      throw error;
    }
  } 

  handleRssFeedError(err: any, dispatch: Dispatch<RSSAction>): SetRSSFeedError {
    const { responseMsg, status, error, errorMessages } = processAxiosError(err);
    return dispatch({ type: "SetRSSFeedError", payload: { status, responseMsg, error, errorMessages, loading: false } });
  };
}

export const RssActions = new RSSReduxActions();