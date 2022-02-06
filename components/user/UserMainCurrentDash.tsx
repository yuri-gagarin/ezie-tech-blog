import * as React from 'react';
import { Button, Divider, Grid, Header, Icon, Segment, Search } from "semantic-ui-react";
// types //
import { BlogPostData } from '@/redux/_types/blog_posts/dataTypes';
// styles //
import styles from "@/styles/user/UserMainCurrentPost.module.css";

export interface IUserMainCurrentPostProps {
  currentPostData: BlogPostData;
}

export const UserMainCurrentDash: React.FC<IUserMainCurrentPostProps> = ({ currentPostData }): JSX.Element => {
  return (
    <div className={ styles.userMainCurrentPostWrapper }>
      <Segment placeholder style={{ width: "100%", margin: 0 }}>
        <Grid columns={2} stackable textAlign='center'>
          <Divider vertical>Or</Divider>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <Header icon>
                <Icon name='search' />
                Find Post
              </Header>

              <Search placeholder='Search posts...' />
            </Grid.Column>

            <Grid.Column>
              <Header icon>
                <Icon name="newspaper" />
                View Latest Post
              </Header>
              <Button primary>View</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment placeholder style={{ width: "100%", margin: 0 }}>
        <Grid columns={2} stackable textAlign='center'>
          <Divider vertical>Or</Divider>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <Header icon>
                <Icon name='search' />
                Find Comment
              </Header>

              <Search placeholder='Search comments...' />
            </Grid.Column>

            <Grid.Column>
              <Header icon>
                <Icon name="comments" />
                View Latest 10 Comments
              </Header>
              <Button primary>View</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

