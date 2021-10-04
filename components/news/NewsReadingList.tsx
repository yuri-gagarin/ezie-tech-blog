import * as React from 'react';
import { Button, Header, Icon, Item, Segment } from "semantic-ui-react";
// types //
import type { IAuthState } from '@/redux/_types/auth/dataTypes';
// styles //
import styles from "@/styles/news/NewsReadingList.module.css";

interface IFeedReadingListProps {
  authState: IAuthState
}

export const NewsReadingList: React.FunctionComponent<IFeedReadingListProps> = ({ authState }): JSX.Element => {
  const { loggedIn, authToken  } = authState;
  return (
    (loggedIn && authToken)
    ?
    <Segment className={ styles.newsReadingListSegment }>
      <Header>My Reading List</Header>
      <Item.Group>
        <Item>
    
        </Item>
      </Item.Group>
    </Segment>
    :
    <Segment className={ styles.newsReadingListLogin }>
      <Icon size="huge" color="blue" name="book" />
      <Header>Log in to view your reading list</Header>
    </Segment>
  );
};

