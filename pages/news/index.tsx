import * as React from 'react';
import { Grid } from "semantic-ui-react"; 
// redux imports and actions //
import { useDispatch } from "react-redux";
import { RssActions } from '@/redux/actions/rssActions';
// types //
import type { Dispatch } from "redux";
import type { RSSAction } from '@/redux/_types/rss/actionTypes';
import type { FetchRSSOptions } from '@/redux/_types/rss/dataTypes';
// styles //
import styles from "@/styles/news/NewsMainPage.module.css";

interface INewsMainPageProps {
}

const NewsMainPage: React.FunctionComponent<INewsMainPageProps> = (props): JSX.Element => {
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<RSSAction>>();

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
    </div>
  );
};

export default NewsMainPage;
