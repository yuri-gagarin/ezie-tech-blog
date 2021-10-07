import axios from "axios";
// types //
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Dispatch } from "redux";
import type { FetchRSSFeed, RSSAction, SetRSSFeedError, GetRSSReadingList, AddRSSToReadingList, RemoveRSSFromReadingList, ClearRSSFeedError } from "@/redux/_types/rss/actionTypes";
import type { FetchRSSOptions, IRSSState, RSSData, GetReadingListRes, AddToReaderRes, RemoveFromReaderRes, GetRSSRes } from "@/redux/_types/rss/dataTypes";
// helpers //
import { processAxiosError } from "../_helpers/dataHelpers";

class RSSReduxActions {

  async getRSSFeed({ dispatch, optsData }: { dispatch: Dispatch<RSSAction>; optsData: FetchRSSOptions }): Promise<FetchRSSFeed>  {
    const { option, redditOpts = null, mediumOpts = null, getOpts = null, currentPage = 1 } = optsData;
    const reqOpts: AxiosRequestConfig = {
      method: "GET",
      url: `/api/rss/${option}`,
      params: { ...redditOpts, ...mediumOpts, ...getOpts }
    }
    dispatch({ type: "RSSAPIRequest", payload: { loading: true, error: null, errorMessages: null } });
    try {
      const { status, data }: AxiosResponse<GetRSSRes> = await axios(reqOpts);
      const { responseMsg, source, title, logoURL, lastItemId, rssFeed } = data;
      return dispatch({ 
        type: "FetchRSSFeed",  
        payload: { status, responseMsg, source, title, logoURL, lastItemId, currentPage, rssFeed, error: null, errorMessages: null, loading: false }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  } 

  async handleGetReadingList(data: { dispatch: Dispatch<RSSAction>; JWTToken: string; }): Promise<GetRSSReadingList> {
    const { dispatch, JWTToken } = data;
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