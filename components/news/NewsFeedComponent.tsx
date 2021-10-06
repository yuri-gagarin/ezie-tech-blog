import * as React from 'react';
import { Container, Item, Label, Popup } from "semantic-ui-react";
// next imports //
import NextImage from "next/image";
// additional components //
import { GeneralLoadingComponent } from '../shared/GeneralLoadingComponent';
// types //
import type { IRSSState, RSSData } from "@/redux/_types/rss/dataTypes";
// styles //
import styles from "@/styles/news/NewsFeedComponent.module.css";
// helpers //
import { formatTimeString } from "@/components/_helpers/displayHelpers";


interface INewsFeedComponentProps {
  rssState: IRSSState;
  handleGoToArticle(articleLink: string): void;
  handleAddToReadingList(rssData: RSSData): Promise<any>;
}

export const NewsFeedComponent: React.FunctionComponent<INewsFeedComponentProps> = ({ rssState, handleGoToArticle, handleAddToReadingList }): JSX.Element => {
  const { loading } = rssState;
  return (
    loading
    ?
    <GeneralLoadingComponent loaderText="Loading feed"  />
    :
    <Container className={ styles.feedContainer }>
      <Item.Group divided>
        {
          rssState.rssFeed.map((rssData) => {
            return (
              <Item key={ rssData.articleLink } className={ styles.feedItem } >
                <div className= { styles.feedImage }>
                  <NextImage src={ rssData.thumbnailPreviewURI ? rssData.thumbnailPreviewURI : "/images/defaults/generic_rss.svg" } height="50px" width="50px" objectFit="contain" />
                </div>
                <Item.Content className={ styles.feedContent}>
                  <Item.Header as="a" onClick={ () => handleGoToArticle(rssData.articleLink) }>
                    { rssData.title }
                  </Item.Header>
                  <Item.Meta>{`Posted by: ${rssData.author.username || "Anonymous"}`}</Item.Meta>
                  <Item.Meta>
                    {`Published at: ${formatTimeString(rssData.published, { yearMonthDay: true } )}`}
                  </Item.Meta>
                </Item.Content>
                <Popup
                  content="Add to reading list"
                  trigger={ 
                    <Label className={ styles.addToReaderLabel } color="purple" attached="bottom right" icon="plus square outline" onClick={ () => handleAddToReadingList(rssData) }/> 
                  }
                />
              </Item>
            )
          })
        }
      </Item.Group>
    </Container>
  );
};

