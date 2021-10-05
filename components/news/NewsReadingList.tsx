import * as React from 'react';
import { Button, Header, Icon, Item, Segment } from "semantic-ui-react";
// types //
import type { IAuthState } from '@/redux/_types/auth/dataTypes';
// styles //
import styles from "@/styles/news/NewsReadingList.module.css";

interface IFeedReadingListProps {
  authState: IAuthState
}

export const NewsReadingList: React.FC<IFeedReadingListProps> = ({ authState }): JSX.Element => {
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
      <Header>My Reading List</Header>
      <Item.Group>
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

