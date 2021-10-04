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
// types //
import type { DropdownItemProps } from "semantic-ui-react";
import type { Dispatch } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { RSSAction } from '@/redux/_types/rss/actionTypes';
import type { FetchRSSOptions, RSSSources } from '@/redux/_types/rss/dataTypes';
// styles //
import styles from "@/styles/news/NewsMainPage.module.css";
// helpers //
import { formatTimeString } from "@/components/_helpers/displayHelpers"

interface INewsMainPageProps {
}

const NewsMainPage: React.FunctionComponent<INewsMainPageProps> = (props): JSX.Element => {
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<RSSAction>>();
  const { rssState } = useSelector((state: IGeneralState) => state);

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
    <div className={ styles.newsMainPageGrid }>
      <Grid.Row className={ styles.headerRow }>
        <div>Hello there</div>
      </Grid.Row>
      <Grid.Row>
        <NewsControls 
          source={ rssState.source }
          handleRSSSourceSelect={ handleRSSSourceSelect } 
        />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column mobile={ 16 }>
          <Container>
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
      </Grid.Row>
    </div>
  );
};

export default NewsMainPage;
