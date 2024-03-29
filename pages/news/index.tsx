import * as React from 'react';
import { Container, Grid } from "semantic-ui-react"; 
// next imports //
import Head from 'next/head';
// redux imports and actions //
import { useDispatch, useSelector } from "react-redux";
import { RssActions } from '@/redux/actions/rssActions';
// additonal components //
import { GenInfoModal } from "@/components/modals/GenInfoModal";
import { NewsControls } from "@/components/news/NewsControls";
import { NewsFeedComponent } from '@/components/news/NewsFeedComponent';
import { NeedLoginModal } from "@/components/modals/NeedLoginModal";
import { NewsReadingList } from "@/components/news/NewsReadingList";
// types //
import type { DropdownItemProps, PaginationProps } from "semantic-ui-react";
import type { Dispatch } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { RSSAction } from '@/redux/_types/rss/actionTypes';
import type { FetchRSSOptions, RSSData, RSSSources } from '@/redux/_types/rss/dataTypes';
// styles //
import styles from "@/styles/news/NewsMainPage.module.css";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";
import { openInNewTab } from "@/components/_helpers/miscComponentHelprs";

interface INewsMainPageProps {

}

const NewsMainPage: React.FunctionComponent<INewsMainPageProps> = (props): JSX.Element => {
  // local state and hooks //
  const [ needLoginModalOpen, setNeedLoginModalOpen ] = React.useState<boolean>(false);
  const [ infoModalState, setInfoModalState ] = React.useState<{ open; header: string; messages: string[]; }>({ open: false, header: "", messages: [] });
  // next hooks //
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<RSSAction>>();
  const { authState, rssState } = useSelector((state: IGeneralState) => state);
  // custom hooks //
  const { width } = useWindowSize();

  // action handlers //
  const handleGoToArticle = (link: string): void => {
    openInNewTab(link);
  };
  const handleCloseNeedLoginModal = (): void => {
    setNeedLoginModalOpen(false);
  };
  const handleCloseInfoModal = (): void => {
    setInfoModalState({ open: false, header: "", messages: [] });
  };
  
  const handleAddToReadingList = async (rssData: RSSData): Promise<any> => {
    const { loggedIn, authToken: JWTToken } = authState;
    const { readingList } = rssState;
   
    if (readingList.some((data) => data.articleLink === rssData.articleLink)) {
      return setInfoModalState({ open: true, header: "Ooops..", messages: [ "This item already exists in your reading list" ] });
    }

    if (loggedIn && JWTToken) {
      try {
        return await RssActions.handleAddToReadingList({ dispatch, rssData, JWTToken, rssState });
      } catch (error) {
        RssActions.handleRssFeedError(error, dispatch);
      }
    } else {
      return setNeedLoginModalOpen(true);
    }
   
  };
  const handleRemoveFromReadingList = async (rssDataId: string) => {
    const { loggedIn, authToken: JWTToken } = authState;
    if (loggedIn && JWTToken) {
      try {
        await RssActions.handleRemoveFromReadingList({ dispatch, JWTToken, rssDataId, rssState });
      } catch (error) {
        RssActions.handleRssFeedError(error, dispatch);
      }
    } else {
      setNeedLoginModalOpen(true);
    }
  }
  const handleRSSSourceSelect = async (_, data: DropdownItemProps): Promise<any> => {
    const source = data.value as RSSSources;
    try {
      await RssActions.getRSSFeed({ dispatch, optsData: { option: source } });
    } catch (error) {
      RssActions.handleRssFeedError(error, dispatch);
    }
  };

  const handleRSSFeedPageChange = async (e, data: PaginationProps): Promise<any> => {
    const { currentPage, lastItemId } = rssState;
    const nextPage: number = Number(data.activePage);
    try {
      if (nextPage === currentPage) return;
      if (nextPage > currentPage) { 
        await RssActions.getRSSFeed(
          { dispatch, optsData: { option: "reddit", currentPage: nextPage, getOpts: { limit: 10, after: lastItemId } } }
        );
      } else {
        await RssActions.getRSSFeed({ dispatch, optsData: { option: "reddit", currentPage: nextPage, getOpts: { limit: 10, before: lastItemId } } });
      }
    } catch (error) {
      return RssActions.handleRssFeedError(error, dispatch);
    }
  };
  // END action handlers //
  
  // lifecycle hooks //
  React.useEffect(() => {
    const { loggedIn, authToken: JWTToken } = authState;
    let loaded = true;
    if (loaded) {
      (async function(): Promise<any> {
        try {
          if (!rssState.source) await RssActions.getRSSFeed({ dispatch, optsData: { option: "reddit" } });
          if (loggedIn && JWTToken) await RssActions.handleGetReadingList({ dispatch, JWTToken });
        } catch (error) {
          RssActions.handleRssFeedError(error, dispatch)
        }
      })();
    }
    return () => { loaded = false };
  }, [ dispatch, authState, rssState.source ]);
  // clear info modal if open //
  React.useEffect(() => {
    if (infoModalState.open) {
      setTimeout(() => {
        if (infoModalState.open) setInfoModalState({ open: false, header: "", messages: [] });
      }, 2000);
    }
  }, [ infoModalState ]);

  return (
    <Grid divided className={ styles.newsMainPageGrid } style={{ border: "4px solid green"}}>
      <NeedLoginModal modalOpen={ needLoginModalOpen } handleCloseModal={ handleCloseNeedLoginModal } />
      <GenInfoModal 
        position="fixed-top"
        duration={100}
        open={ infoModalState.open } header={ infoModalState.header } messages={ infoModalState.messages } handleInfoModalClose={ handleCloseInfoModal } 
      />
      <Head>
        <title>Tech News</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />        <meta name="description" content="Eezie tech. We make tech easy for people of all backgrounds." />
        <meta name="keywords" content="programming web development nodej typescript react javascript express"></meta>
      </Head>
      <Grid.Row className={ styles.headerRow } >
        <h1>RSS News</h1>
      </Grid.Row>
      <Grid.Row className={ styles.feedRow } centered >
        <Grid.Column mobile={16} computer={10}>
          <Container>
            <NewsControls 
              source={ rssState.source }
              handleRSSSourceSelect={ handleRSSSourceSelect } 
            />
            <NewsFeedComponent 
              rssState={ rssState }
              handleGoToArticle= { handleGoToArticle }
              handleAddToReadingList={ handleAddToReadingList }
              handleRSSFeedPageChange={ handleRSSFeedPageChange }
            />
          </Container>
        </Grid.Column>
        {
          width > 990 
          ?
          <Grid.Column computer={4}>
            <NewsReadingList 
              readingList={ rssState.readingList } 
              authState={ authState } 
              handleRemoveFromReadingList={ handleRemoveFromReadingList }
            />
          </Grid.Column>
          :
          null
        }
        
      </Grid.Row>
    </Grid>
  );
};

export default NewsMainPage;
