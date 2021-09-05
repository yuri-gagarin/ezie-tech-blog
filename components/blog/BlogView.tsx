import React from "react";
import { Card, Grid, Image } from "semantic-ui-react";
// additional components //
import { BlogSortControls } from "./BlogSortControls";
// styles //
import blogViewStyle from "../../styles/blog/BlogView.module.css";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";

export const BlogView: React.FC<{}> = (): JSX.Element => {

  const { width } = useWindowSize();

  const handleBlogPostSelect = ():void => {

  };

  return (
    width > 1200 ?
      <Grid.Column largeScreen={4} tablet={8} mobile={16} className={ blogViewStyle.gridColumn }>
        <div className={ blogViewStyle.sortControlsWrapper }>
          <BlogSortControls />
        </div>
        <Card.Group className={ blogViewStyle.cardGroup } centered >
          <Card fluid className={ blogViewStyle.sideCard } onClick={ handleBlogPostSelect }>
            <Image src="/images/blog1.jpg" size="small" />
            <Card.Content>
              <Card.Header>Title here</Card.Header>
              <Card.Meta>Posted at: 2021</Card.Meta>
              <Card.Description>A description goes here</Card.Description>
            </Card.Content>
          </Card>
          <Card fluid className={ blogViewStyle.sideCard }>
            <Image src="/images/blog1.jpg" size="small"  />
            <Card.Content>
              <Card.Header>Title here</Card.Header>
              <Card.Meta>Posted at: 2021</Card.Meta>
              <Card.Description>A description goes here</Card.Description>
            </Card.Content>
          </Card>
          <Card fluid className={ blogViewStyle.sideCard }>
            <Image src="/images/blog1.jpg" size="small"  />
            <Card.Content>
              <Card.Header>Title here</Card.Header>
              <Card.Meta>Posted at: 2021</Card.Meta>
              <Card.Description>A description goes here</Card.Description>
            </Card.Content>
          </Card>
          <Card fluid className={ blogViewStyle.sideCard }>
            <Image src="/images/blog1.jpg" size="small"  />
            <Card.Content>
              <Card.Header>Title here</Card.Header>
              <Card.Meta>Posted at: 2021</Card.Meta>
              <Card.Description>A description goes here</Card.Description>
            </Card.Content>
          </Card>
        </Card.Group>
      </Grid.Column>
    :
    <></>
  );
};