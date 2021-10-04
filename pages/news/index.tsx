import * as React from 'react';
import { Container, Grid, Item } from "semantic-ui-react"; 
// next imports //
import NextImage from "next/image";
import { useRouter } from 'next/router';
// redux imports and actions //
import { useDispatch, useSelector } from "react-redux";
import { RssActions } from '@/redux/actions/rssActions';
// additonal components //
import { NewsControls } from "@/components/news/NewsControls";
import { NewsReadingList } from "@/components/news/NewsReadingList";
// types //
import type { DropdownItemProps } from "semantic-ui-react";
import type { Dispatch } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { RSSAction } from '@/redux/_types/rss/actionTypes';
import type { FetchRSSOptions, RSSSources } from '@/redux/_types/rss/dataTypes';
// styles //
import styles from "@/styles/news/NewsMainPage.module.css";
// helpers //
import { formatTimeString } from "@/components/_helpers/displayHelpers";
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";

interface INewsMainPageProps {
}

const NewsMainPage: React.FunctionComponent<INewsMainPageProps> = (props): JSX.Element => {
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<RSSAction>>();
  const { authState, rssState } = useSelector((state: IGeneralState) => state);
  // custom hooks //
  const { width } = useWindowSize();

  // action handlers //
  const handleGoToArticle = (link: string): void => {
    router.push(link);
  };
  const handleRSSSourceSelect = async (_, data: DropdownItemProps): Promise<any> => {
    const source = data.value as RSSSources;
    try {
      await RssActions.getRSSFeed({ dispatch, optsData: { option: source } });
    } catch (error) {
      RssActions.handleRssFeedError(error, dispatch);
    }
  };
  // END action handlers //
  
  // lifecycle hooks //
  React.useEffect(() => {
    let loaded = true;
    if (loaded) {
      (async function(): Promise<any> {
        try {
          const optsData: FetchRSSOptions = { option: "reddit" };
          //const optsDataO: FetchRSSOptions = { option: "medium" };
          await RssActions.getRSSFeed({ dispatch, optsData });
          //await RssActions.getRSSFeed({ dispatch, optsData: { option: "medium" } })
        } catch (error) {
          RssActions.handleRssFeedError(error, dispatch)
        }
      })();
    }
    return () => { loaded = false };
  }, [ dispatch ]);

  return (
    <Grid className={ styles.newsMainPageGrid }>
      <Grid.Row className={ styles.headerRow }>
        <h1>RSS News</h1>
      </Grid.Row>
      <Grid.Row centered className={ styles.feedRow }>
        <Grid.Column mobile={16} computer={10}>
          <NewsControls 
            source={ rssState.source }
            handleRSSSourceSelect={ handleRSSSourceSelect } 
          />
          <Container className={ styles.feedContainer }>
            <Item.Group divided>
              {
                rssState.rssFeed.map((rssData) => {
                  return (
                    <Item key={ rssData.articleLink } className={ styles.feedItem } >
                      <div className= { styles.feedImage }>
                        <NextImage src={ rssData.thumbnailPreviewURI ? rssData.thumbnailPreviewURI : "/images/defaults/generic_rss.svg" } height="50px" width="50px" objectFit="cover" />
                      </div>
                      <Item.Content className={ styles.feedContent}>
                        <Item.Header as="a" onClick={ () => handleGoToArticle(rssData.articleLink) }>
                          { rssData.title }
                        </Item.Header>
                        <Item.Meta>
                          {`Published at: ${formatTimeString(rssData.published, { yearMonthDay: true } )}`}
                        </Item.Meta>
                      </Item.Content>
                    </Item>
                  )
                })
              }
            </Item.Group>
          </Container>
        </Grid.Column>
        {
          width > 990 
          ?
          <Grid.Column computer={4}>
            <NewsReadingList authState={ authState } />
          </Grid.Column>
          :
          null
        }
        
      </Grid.Row>
    </Grid>
  );
};

export default NewsMainPage;
