import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
  },
  description: {
    type: String,
    required: true,
  },
  challenges: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  languages: {
    js: { type: Boolean, default: false },
    ts: { type: Boolean, default: false },
    python: { type: Boolean, default: false },
    ruby: { type: Boolean, default: false },
    cSharp: { type: Boolean, default: false },
    goLang: { type: Boolean, default: false }
  },
  libraries: {
    bootstrap: { type: Boolean, default: false },
    semanticUI: { type: Boolean, default: false },
    materialUI: { type: Boolean, default: false  },
    jquery: { type: Boolean, default: false },
    react: { type: Boolean, default: false },
    reactNative: { type: Boolean, default: false },
    redux: { type: Boolean, default: false },
  },
  frameworks: {
    rails: { type: Boolean, deafult: false },
    nextJS: { type: Boolean, deafult: false },
    gatsbyJS: { type: Boolean, deafult: false },
    django: { type: Boolean, deafult: false },
    flask: { type: Boolean, deafult: false },
    ASP: { type: Boolean, deafult: false },
  },
  createdAt: { type: Date, default: new Date() },
  editedAt: { type: Date, default: new Date() }
})