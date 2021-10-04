export type RSSData = {
  author: { username?: string; uri?: string };
  thumbnailPreviewURI?: string;
  articleLink: string;
  title: string;
  published: string;
  updated: string;
}

export const parseRedditRSSObj = (rssObj: any): { source: "reddit"; title: string; logoURL: string; rssFeed: RSSData[]; } => {
  const entries: RSSData[] = [];
  const foundEntries: any[] = rssObj.feed.entry;
  const title = rssObj.feed.title[0];
  const logoURL = rssObj.feed.logo[0];
  for (const entry of foundEntries) {
    const data: RSSData = {
      author: {
        username: entry.author[0].name[0],
        uri: entry.author[0].uri[0]
      },
      thumbnailPreviewURI: entry["media:thumbnail"] ? entry["media:thumbnail"][0].$.url : "",
      articleLink: entry.link[0].$.href,
      title: entry.title[0],
      published: entry.published[0],
      updated: entry.updated[0]
    };
    entries.push(data);
  }
  return { source: "reddit", title, logoURL, rssFeed: entries };
};