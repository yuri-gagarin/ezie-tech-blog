import React from "react";
import { Card, Grid, Image, Segment } from "semantic-ui-react";
// styles //
import blogEntryStyle from "../../styles/blog/BlogEntry.module.css";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";
export const BlogEntry: React.FC<{}> = (): JSX.Element => {

  const { width } = useWindowSize();

  return (
    <Grid.Column className={ blogEntryStyle.blogEntryColumn } largeScreen={ 12 } tablet= { 16 } mobile= { 16 }>
      <Card.Group className={ blogEntryStyle.cardGroup } centered={ width <  600 ? true : false }>
        <Card raised fluid={ width > 600 ? true : false }>
          <Image src="/images/blog1.jpg" size="large" />
          <Card.Content>
            <Card.Header>Title here</Card.Header>
            <Card.Meta>Posted at: 2021</Card.Meta>
            <Card.Description>A description goes here</Card.Description>
          </Card.Content>
        </Card>
        <Card raised>
          <Image src="/images/blog1.jpg" />
          <Card.Content>
            <Card.Header>Title here</Card.Header>
            <Card.Meta>Posted at: 2021</Card.Meta>
            <Card.Description>A description goes here</Card.Description>
          </Card.Content>
        </Card>
        <Card raised>
          <Image src="/images/blog1.jpg" />
          <Card.Content>
            <Card.Header>Title here</Card.Header>
            <Card.Meta>Posted at: 2021</Card.Meta>
            <Card.Description>A description goes here</Card.Description>
          </Card.Content>
        </Card>
        <Card raised>
          <Image src="/images/blog1.jpg" />
          <Card.Content>
            <Card.Header>Title here</Card.Header>
            <Card.Meta>Posted at: 2021</Card.Meta>
            <Card.Description>A description goes here</Card.Description>
          </Card.Content>
        </Card>
      </Card.Group>
    </Grid.Column>
  );
};