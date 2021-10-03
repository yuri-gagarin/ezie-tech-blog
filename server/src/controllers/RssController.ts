import type { Request, Response } from "express";

export type RSSGetParams = {
  option: "reddit" | "cnet" | "medium";
  
}
export type RSSQueryParams = {
  redditOpts?: {
    filter?: "new" | "hot" | "top";
    subreddit?: "technology" | "apple" | "windows" | "mobile" | "realtech" | "tech";
  };
  mediumOpts?: {
    topic?: string;
    user?: string;
  };
}
export class RssController {
  handleRssRequest = async (req: Request, res: Response) => {
    const { option }: RSSGetParams = req.params as RSSGetParams;
    const { redditOpts, mediumOpts } = req.query as RSSQueryParams;
    let url: string;
    switch (option) {
      case "reddit": {
        const baseURL = "http://www.reddit.com/r";
        const { subreddit = "technology", filter = "hot" } = redditOpts ? redditOpts : {};
        url = `${baseURL}/${subreddit}/${filter}/.rss`;
        break;
      }
      case "medium": {
        const baseURL = "https://www.medium.com/feed";
        const { topic = "tech", user = null } = mediumOpts ? mediumOpts : {};
        if (user) url = `${baseURL}/@${user}`;
        else url = `${baseURL}/tag/${topic}`;
        break;
      }
      case "cnet": {
        url = "http://www.reddit.com/r/technology/hot/.rss";
        break;
      }
      default: {
        return res.status(500).json({
          responseMsg: "Error",
          error: new Error("RSS feed error"),
          errorMessages: [ "Could not resolve RSS feed" ]
        })
      }
    }
    try {
      const response = await fetch(url);
      const text = await response.text();
      res.setHeader("Content-Type", "application/rss-xml");
      res.send(text);
      console.log(53)
    } catch (error) {
      console.log("rss error");
      console.log(error)
      return res.status(500).json({
        responseMsg: "Error",
        error: new Error("RSS feed error"),
        errorMessages: [ "Could not resolve RSS feed" ]
      });
    }
  }
}