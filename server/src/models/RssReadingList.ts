import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";
import type { RSSData } from "../_types/news/newsTypes";

export interface IRssReadingList extends Document {
  userId: mongoose.Types.ObjectId;
  items: RSSData[];
  createdAt: Date;
  editedAt: Date;
}

const RssReadingListSchema = new Schema({
  userId: {
    type:  Schema.Types.ObjectId,
    required: true,
    index: true
  },
  items: {
    type: [{
      _id: Schema.Types.ObjectId,
      author: {
          username: String,
          uri: String,
      },
      thumbnailPreviewURI: String,
      articleLink: String,
      category: [String],
      provider: String,
      title: String,
      published: {
        type: Date,
        default: new Date()
      },
      updated: {
        type: Date,
        default: new Date()
      }
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  editedAt: {
    type: Date,
    default: new Date()
  }
});

export default mongoose.model<IRssReadingList>("RssReadingList", RssReadingListSchema);
