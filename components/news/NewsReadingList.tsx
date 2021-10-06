import * as React from 'react';
import { Button, Header, Icon, Item } from "semantic-ui-react";
// next imports //
import NextImage from "next/image";
// types //
import type { IAuthState } from '@/redux/_types/auth/dataTypes';
import type { RSSData } from '@/redux/_types/rss/dataTypes';
// styles //
import styles from "@/styles/news/NewsReadingList.module.css";
// helpers //
import { formatTimeString } from "@/components/_helpers/displayHelpers"
interface IFeedReadingListProps {
  authState: IAuthState;
  readingList: RSSData[];
  handleRemoveFromReadingList(rssId: string): Promise<any>;
}

export const NewsReadingList: React.FC<IFeedReadingListProps> = ({ authState, readingList, handleRemoveFromReadingList }): JSX.Element => {
  const { loggedIn, authToken  } = authState;
  // local state and refs //
  const [ elementFixed, setElementFixed ] = React.useState<boolean>(false);
  const readingListRef = React.useRef<HTMLDivElement>();
  
  // lifecycle hooks //
  React.useEffect(() => {
    const intersectionCallback = (entries: IntersectionObserverEntry[]): void => {
      const [ entry ] = entries;
      if (entry.boundingClientRect.top < 60) {
        if (!elementFixed) setElementFixed(true);
      } else {
        if (elementFixed) setElementFixed(false);
      }
    };
    const { current } = readingListRef;
    const readingListObserver = new IntersectionObserver(intersectionCallback, { root: null, rootMargin: "0px", threshold: 1.0 });
    if (current) readingListObserver.observe(current);
    return () => {
      if (current) readingListObserver.unobserve(current);
    }
  }, [ readingListRef, elementFixed ]);

  return (
    loggedIn && authToken
    ?
    <div className={ `${styles.newsReadingListSegment} ${elementFixed ? styles.fixed : "" }` } ref={ readingListRef }>
      <div className={ styles.headerDiv }>
        <h3>My Reading List</h3>
      </div>
      <Item.Group className={ styles.readingListItemsWrapper } divided>
        {
          readingList.length > 0
          ?
          readingList.map((rssData) => {
            return (
              <Item className={ styles.rssReadingListItem } key={ rssData.articleLink }>
                <Item.Content>
                  <Item.Header as="a">{ rssData.title } </Item.Header>
                  <Item.Meta>{`Published at: ${formatTimeString(rssData.published, { yearMonthDay: true } )}`}</Item.Meta>
                  <Item.Description className={ styles.rssReadingListItemControls }>
                    <div className={ styles.itemLogoDiv }>
                      <NextImage src={"/logos/rss_logos/cnet_logo.svg"} height="30px" width="30px" objectFit="contain" />
                    </div>
                    <Button size="mini" color="orange" content="Remove" onClick={ () => handleRemoveFromReadingList(rssData._id) }/>
                  </Item.Description>
                </Item.Content>
              </Item>
            )
          })
          :
          <div className={ styles.noItemsDiv }>
            <div>No items in the reading list yet</div>
            <div>Items you add will appear here</div>
          </div>
        }
        <Item>

        </Item>
      </Item.Group>
    </div>
    :
    <div className={ `${styles.newsReadingListLogin} ${elementFixed ? styles.fixed : "" }`} ref={ readingListRef } >
      <Icon size="huge" color="blue" name="book"  />
      <Header textAlign="center">Log in to view your reading list</Header>
    </div>
  );
};

/*

*/

