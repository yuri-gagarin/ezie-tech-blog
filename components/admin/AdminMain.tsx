import * as React from 'react';
import { Button, Grid, Header, Segment } from "semantic-ui-react";
// additoinal components //
import { AdminMainCurrentPost } from './AdminMainCurrentPost';
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
    <Grid.Row className={ adminMainStyles.adminMainRow }> 
      <Grid.Column className={ adminMainStyles.leftColumn } width={5}>
        <Segment textAlign="center">
          <Header>Total Blog Posts</Header>
          <div>{blogPostsState.blogPosts.length}</div>
        </Segment>
        <Segment textAlign="center">
          <Header>Total Blog Posts Comments</Header>
          <div>{blogPostsState.blogPosts.length}</div>
        </Segment>
        <Segment textAlign="center">
          <Header>Total Active Users</Header>
          <div>{usersState.usersArr.length}</div>
        </Segment>
        <Segment textAlign="center">
          <Header>Total Active Projects</Header>
          <div>{usersState.usersArr.length}</div>
        </Segment>
        <Segment textAlign="center">
          <Header>Total Closed Projects</Header>
          <div>{usersState.usersArr.length}</div>
        </Segment>
        <Segment textAlign="center">
          <Header>Analytics</Header>
          <Button content="Go to Analytics" color="blue" />
        </Segment>
      </Grid.Column>
      <Grid.Column className={ adminMainStyles.rightColumn } width={11}>
          <AdminMainCurrentPost />
      </Grid.Column>
    </Grid.Row>
  );
};

