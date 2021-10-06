import * as React from 'react';
import { Container, Grid, Item, Label, Popup } from "semantic-ui-react"; 
// next imports //
import NextImage from "next/image";
import { useRouter } from 'next/router';
// redux imports and actions //
import { useDispatch, useSelector } from "react-redux";
import { RssActions } from '@/redux/actions/rssActions';
// additonal components //
import { NewsControls } from "@/components/news/NewsControls";
import { NewsReadingList } from "@/components/news/NewsReadingList";
import { NeedLoginModal } from "@/components/modals/NeedLoginModal";
import { GenInfoModal } from "@/components/modals/GenInfoModal";
// types //
import type { DropdownItemProps } from "semantic-ui-react";
import type { Dispatch } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { RSSAction } from '@/redux/_types/rss/actionTypes';
import type { FetchRSSOptions, RSSData, RSSSources } from '@/redux/_types/rss/dataTypes';
// styles //
import styles from "@/styles/news/NewsMainPage.module.css";
// helpers //
import { formatTimeString } from "@/components/_helpers/displayHelpers";
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";

interface INewsMainPageProps {
}

const NewsMainPage: React.FunctionComponent<INewsMainPageProps> = (props): JSX.Element => {
  // local state and hooks //
  const [ needLoginModalOpen, setNeedLoginModalOpen ] = React.useState<boolean>(false);
  const [ infoModalState, setInfoModalState ] = React.useState<{ open; header: string; messages: string[]; }>({ open: false, header: "", messages: [] });
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
  // END action handlers //
  
  // lifecycle hooks //
  React.useEffect(() => {
    const { loggedIn, authToken: JWTToken } = authState;
    let loaded = true;
    if (loaded) {
      (async function(): Promise<any> {
        try {
          const optsData: FetchRSSOptions = { option: "reddit" };
          //const optsDataO: FetchRSSOptions = { option: "medium" };
          await RssActions.getRSSFeed({ dispatch, optsData });
          if (loggedIn && JWTToken) await RssActions.handleGetReadingList({ dispatch, JWTToken });
          //await RssActions.getRSSFeed({ dispatch, optsData: { option: "medium" } })
        } catch (error) {
          RssActions.handleRssFeedError(error, dispatch)
        }
      })();
    }
    return () => { loaded = false };
  }, [ dispatch, authState ]);
  // clear info modal if open //
  React.useEffect(() => {
    if (infoModalState.open) {
      setTimeout(() => {
        if (infoModalState.open) setInfoModalState({ open: false, header: "", messages: [] });
      }, 2000);
    }
  }, [ infoModalState ]);

  return (
    <Grid className={ styles.newsMainPageGrid }>
      <NeedLoginModal modalOpen={ needLoginModalOpen } handleCloseModal={ handleCloseNeedLoginModal } />
      <GenInfoModal 
        position="fixed-top"
        duration={100}
        open={ infoModalState.open } header={ infoModalState.header } messages={ infoModalState.messages } handleInfoModalClose={ handleCloseInfoModal } 
      />
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
