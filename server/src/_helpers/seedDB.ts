import mongoSetup from "../database/mongoSetup";
import { generateMockBlogPosts } from "./mockDataGeneration";

(async function() {
  await mongoSetup();
  await generateMockBlogPosts();
  console.log("done");
  process.exit(0);
})();

