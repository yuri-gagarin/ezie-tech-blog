import * as React from 'react';
import { Button, Grid } from "semantic-ui-react";
// next imports //
import NextImage from "next/image";
// styles //
import styles from "@/styles/home/HomeNews.module.css";


interface IHomeNewsProps {
}

export const HomeNews: React.FunctionComponent<IHomeNewsProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ styles.homeNewsRow }>
      <div className={ styles.newsTitleDiv }>News Feeds</div>
        <div className={ styles.newsDescription }>
          <h4>Read about current news and events in tech in our sourced RSS feeds from the hottest tech news sources today</h4>
        </div>
        <div className={ styles.newsLogosWrapper } >
          <div className={ styles.newsLogoItem }>
            <div className={ styles.newsLogo }> 
              <NextImage src="/logos/rss_logos/reddit_logo.svg" height={75} width={75} />
            </div>
            <div className={ styles.newsLogoDescription }>
              Check out the Reddit tech RSS feed for up to date current news
            </div>
          </div>
          <div className={ styles.newsLogoItem }>
            <div className={ styles.newsLogo }> 
              <NextImage src="/logos/rss_logos/medium_logo.svg" height={75} width={75} />
            </div>
            <div className={ styles.newsLogoDescription }>
              Medium RSS feed with new tech news and reviews
            </div>
          </div>
          <div className={ styles.newsLogoItem }>
            <div className={ styles.newsLogo }> 
              <NextImage src="/logos/rss_logos/cnet_logo.svg" height={75} width={75} />
            </div>
            <div className={ styles.newsLogoDescription }>
              CNET RSS feed with up to date news, reviews and discussions

            </div>
          </div>
        </div>
        <div className={ styles.homeNewsControls }>
          <Button color="purple" content="All news feeds" />
        </div>
    </Grid.Row>
  );
};