import React from "react";
import { Card, Grid, Image } from "semantic-ui-react";
// additional components //
import { BlogSortControls } from "./BlogSortControls";
// styles //
import blogViewStyle from "../../styles/blog/BlogSideView.module.css";
import type { BlogPostData } from "../../redux/_types/blog_posts/dataTypes";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";
import { trimStringToSpecificLength, formatTimeString } from "../_helpers/displayHelpers";

interface IBlogViewProps {
  blogPosts: BlogPostData[];
}

export const BlogSideView: React.FC<IBlogViewProps> = ({ blogPosts }): JSX.Element => {

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
          {
            blogPosts.map((blogPost) => {
              return (
                <Card key={ blogPost._id } fluid className={ blogViewStyle.sideCard } onClick={ handleBlogPostSelect }>
                  <Image src="/images/blog1.jpg" size="small" alt="image" />
                  <Card.Content>
                    <Card.Header>{ blogPost.title }</Card.Header>
                    <Card.Meta>{ formatTimeString((blogPost.createdAt as string), { yearMonth: true }) }</Card.Meta>
                    <Card.Description>{ trimStringToSpecificLength(blogPost.content, 50 )}</Card.Description>
                  </Card.Content>
                </Card>
              )
            })
          }
        </Card.Group>
      </Grid.Column>
    :
    <></>
  );
};