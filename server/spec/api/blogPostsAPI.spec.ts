import mongoose from "mongoose";
// 
import chai from "chai";
import chaiHTTP from "chai-http";
import BlogPost from "../../src/models/BlogPost";
// server //
import server from "../../src/server";


chai.use(chaiHTTP);

describe("BlogPost API tests", function() {
  before(async () => {
    console.log("aok")
  });

  describe("GET /api/posts", async function() {

  })
})

export {};