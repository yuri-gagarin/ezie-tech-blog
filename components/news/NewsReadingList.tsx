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
  const [ positionState, setPositionState ] = React.useState<{ fixed: boolean; top: number; left: number; }>({ fixed: false, top: 0, left: 0 });
  const readingListRef = React.useRef<HTMLDivElement>();
  
  // lifecycle hooks //
  React.useEffect(() => {
    let initPositionTop: number;
    let scrollListener: () => void;

    if (readingListRef.current) {
      initPositionTop = readingListRef.current.getBoundingClientRect().top;
      scrollListener = () => {
        if (initPositionTop - 55 <= window.scrollY) {
          if (!positionState.fixed) {
            const { y, x } = readingListRef.current.getBoundingClientRect();
            setPositionState({ fixed: true, top: y, left: x });
          }
        }
        if (window.scrollY < 150 && positionState.fixed) {
          setPositionState({ fixed: false, top: 0, left: 0 });
        }
      }
      window.addEventListener("scroll", scrollListener);
    }
    return () => {
      window.removeEventListener("scroll", scrollListener);
    }
  }, [ readingListRef, positionState ]);

  return (
    loggedIn && authToken 
    ?
    <div className={ `${styles.newsReadingListSegment}` } ref={ readingListRef } style={ positionState.fixed ? { position: "fixed", top: positionState.top, left: positionState.left } : null }>
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
    <div className={ `${styles.newsReadingListLogin}`} ref={ readingListRef } style={ positionState.fixed ? { position: "fixed", top: positionState.top, left: positionState.left } : null }>
      <Icon size="huge" color="blue" name="book"  />
      <Header textAlign="center">Log in to view your reading list</Header>
    </div>
  );
};

/*

*/

