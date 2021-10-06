import { Types } from "mongoose";

export type ClientRSSData = {
  _id?: string;
  author?: { username?: string; uri?: string };
  thumbnailPreviewURI?: string;
  articleLink?: string;
  category?: string[];
  provider?: string;
  author?: string;
  title?: string;
  published?: string;
  updated?: string;
}
export type RSSData = {
  _id: Types.ObjectId;
  author: { username: string; uri: string };
  thumbnailPreviewURI: string;
  articleLink: string;
  category: string[];
  provider: string;
  author: string;
  title: string;
  published: string;
  updated: string;
};
