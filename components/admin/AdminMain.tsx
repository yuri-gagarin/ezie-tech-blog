import * as React from 'react';
import { Button, Card, Grid, Header, Segment } from "semantic-ui-react";
// additoinal components //
import { AdminMainCurrentDash } from './AdminMainCurrentDash';
// styles //
import adminMainStyles from "../../styles/admin/AdminMain.module.css";
// types //
import type { IGeneralAppAction, IGeneralState } from '../../redux/_types/generalTypes';
import type { Dispatch } from "redux";


interface IAdminMainProps {
  generalState: IGeneralState;
  dispatch: Dispatch<IGeneralAppAction>;
}

export const AdminMain: React.FunctionComponent<IAdminMainProps> = ({ generalState }): JSX.Element => {
  const { blogPostsState, usersState } = generalState;
  return (
    <Grid.Row className={ adminMainStyles.adminMainRow } data-test-id="Admin_Main_Page"> 
      <Grid.Column className={ adminMainStyles.leftColumn } width={5}>
        <Card.Group>
          <Card fluid color="blue">
            <Card.Content textAlign="center">
              <Card.Header>Total Blog Posts</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              {blogPostsState.blogPosts.length}
            </Card.Content>
          </Card>
          <Card fluid color="purple">
            <Card.Content textAlign="center">
              <Card.Header>Total Blog Post Comments</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              {blogPostsState.blogPosts.length}
            </Card.Content>
          </Card>
          <Card fluid color="green">
            <Card.Content textAlign="center">
              <Card.Header>Total Users</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              {blogPostsState.blogPosts.length}
            </Card.Content>
          </Card>
          <Card fluid color="violet">
            <Card.Content textAlign="center">
              <Card.Header>Total Active Projects</Card.Header>
            </Card.Content>
            <Card.Content textAlign="center">
              {blogPostsState.blogPosts.length}
            </Card.Content>
          </Card>
          <Card fluid color="teal">
            <Card.Content textAlign="center">
              <Card.Header>Total Closed Projects</Card.Header>
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
      <Grid.Column className={ adminMainStyles.rightColumn } width={11}>
          <AdminMainCurrentDash currentPostData={ blogPostsState.blogPosts[0] } />
      </Grid.Column>
    </Grid.Row>
  );
};

