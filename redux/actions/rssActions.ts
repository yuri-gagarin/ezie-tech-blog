import axios from "axios";
import { parseStringPromise } from "xml2js";
// types //
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Dispatch } from "redux";
import type { FetchRSSFeed, RSSAction, SetRSSFeedError, GetRSSReadingList, AddRSSToReadingList, RemoveRSSFromReadingList, ClearRSSFeedError } from "@/redux/_types/rss/actionTypes";
import type { FetchRSSOptions, IRSSState, RSSData, GetReadingListRes, AddToReaderRes, RemoveFromReaderRes } from "@/redux/_types/rss/dataTypes";
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

  async handleGetReadingList(data: { dispatch: Dispatch<RSSAction>; JWTToken: string; rssState: IRSSState }): Promise<GetRSSReadingList> {
    const { dispatch, JWTToken, rssState } = data;
    const reqOpts: AxiosRequestConfig = {
      method: "GET",
      url: "/api/rss/reading_list/get",
      headers: { "Authorization": JWTToken }
    };
    dispatch({ type: "RSSAPIRequest", payload: { loading: true, error: null, errorMessages: null } });
    try {
      const { status, data }: AxiosResponse<GetReadingListRes> = await axios(reqOpts);
      const { responseMsg, readingListModel } = data;
      const readingList: RSSData[] = readingListModel ? [ ...readingListModel.items ] : [];
      return dispatch({
        type: "GetRSSReadingList",
        payload: { status, responseMsg, readingList, error: null, errorMessages: null, loading: false }
      });
    } catch (error) {
      throw error;
    }
  }

  async handleAddToReadingList(data: { dispatch: Dispatch<RSSAction>; JWTToken: string; rssData: RSSData; rssState: IRSSState }): Promise<AddRSSToReadingList> {
    const { dispatch, JWTToken, rssData, rssState } = data;
    const reqOpts: AxiosRequestConfig = {
      method: "POST",
      url: "/api/rss/reading_list/add",
      headers: { "Authorization": JWTToken },
      data: { rssData }
    };
    dispatch({ type: "RSSAPIRequest", payload: { loading: true, error: null, errorMessages: null } });
    try {
      const { status, data }: AxiosResponse<AddToReaderRes> = await axios(reqOpts);
      const { responseMsg, rssData } = data;
      const updatedList: RSSData[] = [ ...rssState.readingList, rssData ];
      return dispatch({
        type: "AddRSStoReadingList",
        payload: { status, responseMsg, loading: false, readingList: updatedList, error: null, errorMessages: null }
      });
    } catch (error) {
      throw error;
    }
    
  };
  async handleRemoveFromReadingList(data: { dispatch: Dispatch<RSSAction>; JWTToken: string; rssDataId: string; rssState: IRSSState }): Promise<RemoveRSSFromReadingList> {
    const { dispatch, JWTToken, rssDataId, rssState } = data;
    const reqOpts: AxiosRequestConfig = {
      method: "PATCH",
      url: "/api/rss/reading_list/remove",
      headers: { "Authorization": JWTToken },
      data: { rssDataId }
    };
    dispatch({ type: "RSSAPIRequest", payload: { loading: true, error: null, errorMessages: null } });
    try {
      const { status, data }: AxiosResponse<RemoveFromReaderRes> = await axios(reqOpts);
      const { responseMsg, rssDataId } = data;
      const updatedList: RSSData[] = rssState.readingList.filter((_rssData) => _rssData._id !== rssDataId);
      return dispatch({
        type: "RemoveRSSFromReadingList",
        payload: { status, responseMsg, loading: false, readingList: updatedList, error: null, errorMessages: null }
      });
    } catch (error) {
      throw error;
    }
  };

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