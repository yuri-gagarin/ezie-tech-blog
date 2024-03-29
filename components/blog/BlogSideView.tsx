import React from "react";
import { Button, Grid, Item, Image, Label } from "semantic-ui-react";
// additional components //
import { BlogSortControls } from "./BlogSortControls";
import { BlogPostLikes } from "./BlogPostLikes";
// styles //
import styles from "@/styles/blog/BlogSideView.module.css";
// types //
import type { BlogPostData, SearchCategories } from "@/redux/_types/blog_posts/dataTypes";
import type { AdminData, UserData } from "@/redux/_types/users/dataTypes";
// helpers //
import { trimStringToSpecificLength, formatTimeString, capitalizeString } from "../_helpers/displayHelpers";
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";

interface IBlogViewProps {
  blogPosts: BlogPostData[];
  currentUserData: AdminData | UserData | null;
  navigateToBlogPost(blogPostId: string): void;
  handleBlogPostSort({ category, date, popularity }: { category?: SearchCategories; date?: "asc" | "desc"; popularity?: string }): Promise<any>;
  handleBlogPostLike(blogPostId: string): Promise<any>;
}

export const BlogSideView: React.FC<IBlogViewProps> = ({ blogPosts, currentUserData, navigateToBlogPost, handleBlogPostSort, handleBlogPostLike }): JSX.Element => {
  // custom hooks //
  const { width } = useWindowSize();
  return (
    <Grid.Column computer={ 6 } tablet={ 8 } mobile={ 16 } className={ styles.gridColumn }>
      <div className={ styles.sortControlsWrapper }>
        <BlogSortControls handleBlogPostSort={ handleBlogPostSort } />
        <div className={ styles.cardGroupWrapper }>
          <Item.Group className={ styles.cardGroup } divided>
          {
            blogPosts.map((blogPost) => {
              return (
                <Item key={ blogPost._id } fluid={"true"} className={ styles.sideItem }>
                  <Image src="/images/blog1.jpg" size="small" alt="image" rounded />
                  <Item.Content>
                    <Item.Header>{ blogPost.title }</Item.Header>
                    <Item.Meta>{ formatTimeString((blogPost.createdAt as string), { yearMonth: true }) }</Item.Meta>
                    <Item.Description>{ trimStringToSpecificLength(blogPost.content, (width < 768 ? 400 : 50) )}</Item.Description>
                    <Item.Extra>
                      <Label className={ styles.infoLabel } icon="tag" content={ capitalizeString(blogPost.category) } />
                      <Label className={ styles.infoLabel } icon="user" color="purple" content={ `Author: ${blogPost.author.name}` } />   
                    </Item.Extra>
                    <Item.Extra>
                      <Button size="small"  basic onClick={ () => navigateToBlogPost(blogPost._id) } color="pink" content="Read" />
                      <BlogPostLikes 
                        attached={ "top right" } 
                        blogPostData={ blogPost } 
                        currentUserData={ currentUserData }
                        handleBlogPostLike={ handleBlogPostLike }
                      />
                    </Item.Extra>
                  </Item.Content>
                </Item>
              )
            })
          }
          </Item.Group>
        </div>
      </div>
    </Grid.Column>
  );
};