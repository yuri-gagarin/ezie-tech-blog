import React from "react";
import { Button, Card, Grid, Image, Label } from "semantic-ui-react";
// additional components //
import { GeneralLoadingSegement } from "@/components/loaders/GeneralLoadingSegment";
import { BlogPostLikes } from "./BlogPostLikes";
// styles //
import styles from "@/styles/blog/BlogMainView.module.css";
// types //
import type { AdminData, UserData } from "@/redux/_types/users/dataTypes";
import type { BlogPostData } from "@/redux/_types/blog_posts/dataTypes";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";
import { formatTimeString, trimStringToSpecificLength, capitalizeString } from "../_helpers/displayHelpers";

interface IBlogMainViewProps {
  blogPosts: BlogPostData[];
  currentUserData: UserData | AdminData;
  navigateToBlogPost(blogPostId: string): void;
  handleBlogPostLike(blogPostId: string): Promise<any>;
}
export const BlogMainView: React.FC<IBlogMainViewProps> = ({ blogPosts, currentUserData, navigateToBlogPost, handleBlogPostLike }): JSX.Element | null => {
  // local state and hooks //
  // custom hooks //
  const { width, height } = useWindowSize();
  // lifecycle hooks //
  /*
  React.useEffect(() => {
    if (blogPosts.length > 0) setDefaultBlogPostData(setDefaultBlogPosts(blogPosts));
  }, [ blogPosts ]);
  */
  
  if (width > 767) {
    return (
      blogPosts.length > 0 
      ?
      <Grid.Column className={ styles.blogEntryColumn } computer={ 9 } tablet= { 8 } mobile= { 16 }>
        <Card.Group className={ styles.cardGroup }>
          <Card className={ styles.mainCard } fluid={ width > 600 ? true : false }>
            <Image src="/images/blog1.jpg" size={ height > 768 ? "large" : "small"} alt="image" />
            <Card.Content>
              <Card.Header>
                { blogPosts[0].title }
              </Card.Header>
              <Label ribbon="right" content={ ` ${capitalizeString(blogPosts[0].category)}` } icon="tag" color="pink" />
              <Label attached="top right" color="purple" content={`Author: ${ blogPosts[0].author }`} icon="user" />
              <Card.Description>
              </Card.Description>
              <Card.Meta style={{ marginTop: "5px" }}>
                <Label color="teal" content={ ` Posted at: ` } icon="clock" />
                <span className={ styles.dateSpan }>{formatTimeString(blogPosts[0].createdAt, { yearMonth: true })}</span>
              </Card.Meta>
              <Card.Description>{ trimStringToSpecificLength(blogPosts[0].content, 500) }</Card.Description>
            </Card.Content>
            <Card.Content className={ styles.bottomContent }>
              <Button className={ styles.readMoreBtn } size="small" basic color="pink" onClick={ () => navigateToBlogPost(blogPosts[0]._id) } content="Read more" />
              <div className={ styles.likesDiv}>
                <BlogPostLikes  
                  blogPostData={ blogPosts[0] } 
                  currentUserData={ currentUserData }
                  handleBlogPostLike={ handleBlogPostLike } 
                />
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </Grid.Column>
      :
      <GeneralLoadingSegement />
    );
  } else {
    return null
  } 
};