import * as React from 'react';
import { Button, Card, Grid  } from "semantic-ui-react";
// additoinal components //
import { UserMainCurrentDash } from './UserMainCurrentDash';
// styles //
import userMainStyles from "@/styles/user/UserMain.module.css";
// types //
import type { IGeneralAppAction, IGeneralState } from '@/redux/_types/generalTypes';
import type { Dispatch } from "redux";


interface IUserMainProps {
  generalState: IGeneralState;
  dispatch: Dispatch<IGeneralAppAction>;
}

export const UserMain: React.FunctionComponent<IUserMainProps> = ({ generalState }): JSX.Element => {
  const { blogPostsState } = generalState;
  return (
    <Grid.Row className={ userMainStyles.userMainRow } data-test-id="user-main-page"> 
      <Grid.Column className={ userMainStyles.leftColumn } width={5}>
        <Card.Group>
          <Card fluid color="blue">
            <Card.Content textAlign="center">
              <Card.Header>Total Blog Posts Created</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              {blogPostsState.blogPosts.length}
            </Card.Content>
          </Card>
          <Card fluid color="blue">
            <Card.Content textAlign="center">
              <Card.Header>Total Posted Blog Posts</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              {blogPostsState.blogPosts.length}
            </Card.Content>
          </Card>
          <Card fluid color="blue">
            <Card.Content textAlign="center">
              <Card.Header>Total Non-Posted Blog Posts</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              {blogPostsState.blogPosts.length}
            </Card.Content>
          </Card>
          <Card fluid color="blue">
            <Card.Content textAlign="center">
              <Card.Header>Total Replies</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              {blogPostsState.blogPosts.length}
            </Card.Content>
          </Card>
          <Card fluid color="teal">
            <Card.Content textAlign="center">
              <Card.Header>Statistics</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              <Button content={"Go To Stats"} />
            </Card.Content>
          </Card>
        </Card.Group>
      </Grid.Column>
      <Grid.Column className={ userMainStyles.rightColumn } width={11}>
          <UserMainCurrentDash currentPostData={ blogPostsState.blogPosts[0] } />
      </Grid.Column>
    </Grid.Row>
  );
};

