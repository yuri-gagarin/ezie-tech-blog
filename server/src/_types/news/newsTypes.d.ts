import { Types } from "mongoose";

export type RSSData = {
  _id: Types.ObjectId;
  author: { username: string; uri: string };
  thumbnailPreviewURI: string;
  articleLink: string;
  category: string[];
  provider: RSSSources | string;
  author: string;
  title: string;
  published: Date;
  updated: Date;
};
