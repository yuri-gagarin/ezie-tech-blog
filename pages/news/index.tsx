import * as React from 'react';
import { Grid } from "semantic-ui-react"; 
import Parser from "rss-parser";
// styles //
import styles from "@/styles/news/NewsMainPage.module.css";

interface INewsMainPageProps {
}

const NewsMainPage: React.FunctionComponent<INewsMainPageProps> = (props): JSX.Element => {

  React.useEffect(() => { 
    async function fetchFeeds() {
      const parser = new Parser();
      const url = "https://cors-anywhere.herokuapp.com/http://www.reddit.com/r/technology/new/.rss"
      try {
        const feed = await parser.parseURL(url);
        console.log(feed);
      } catch (error) {
        console.log(15)
        console.log(error)
      }
    }
    fetchFeeds();
  }, []);

  return (
    <div className={ styles.newsMainPageGrid }>
      <Grid.Row className={ styles.headerRow }>
        <div>Hello there</div>
      </Grid.Row>
    </div>
  );
};

export default NewsMainPage;
