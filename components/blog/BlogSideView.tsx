import React from "react";
import { Button, Card, Grid, Image } from "semantic-ui-react";
// additional components //
import { BlogSortControls } from "./BlogSortControls";
// styles //
import blogViewStyle from "../../styles/blog/BlogSideView.module.css";
// types //
import type { BlogPostData, SearchCategories } from "../../redux/_types/blog_posts/dataTypes";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";
import { trimStringToSpecificLength, formatTimeString, capitalizeString } from "../_helpers/displayHelpers";

interface IBlogViewProps {
  blogPosts: BlogPostData[];
  navigateToBlogPost(blogPostId: string): void;
  handleBlogPostSort({ category, date, popularity }: { category?: SearchCategories; date?: "asc" | "desc"; popularity?: string }): Promise<any>;
}

export const BlogSideView: React.FC<IBlogViewProps> = ({ blogPosts, navigateToBlogPost, handleBlogPostSort }): JSX.Element => {
  const { width } = useWindowSize();

  return (
    <Grid.Column computer={4} tablet={ 8 } mobile={ 16 } className={ blogViewStyle.gridColumn }>
        <div className={ blogViewStyle.sortControlsWrapper }>
          <BlogSortControls handleBlogPostSort={ handleBlogPostSort } />
          <div className={ blogViewStyle.cardGroupWrapper }>
            <Card.Group className={ blogViewStyle.cardGroup } centered >
            {
              blogPosts.map((blogPost) => {
                return (
                  <Card key={ blogPost._id } fluid className={ blogViewStyle.sideCard } onClick={ () => navigateToBlogPost(blogPost._id) }>
                    <Image src="/images/blog1.jpg" size="small" alt="image" />
                    <Card.Content>
                      <Card.Header>{ blogPost.title }</Card.Header>
                      <Card.Meta>{ formatTimeString((blogPost.createdAt as string), { yearMonth: true }) }</Card.Meta>
                      <Card.Description>{ trimStringToSpecificLength(blogPost.content, 50 )}</Card.Description>
                    </Card.Content>
                    <Card.Content>{ capitalizeString(blogPost.category) }</Card.Content>
                    <Card.Content>
                      <Button onClick={ () => navigateToBlogPost(blogPost._id) } color="pink" content="Read" />
                    </Card.Content>
                  </Card>
                )
              })
            }
            </Card.Group>
          </div>
        </div>
    </Grid.Column>
  );
};