import React from "react";
import { Button, Card, Grid, Image, Label } from "semantic-ui-react";
// additional components //
import { GeneralLoadingSegement } from "../loaders/GeneralLoadingSegment";
// styles //
import styles from "../../styles/blog/BlogMainView.module.css";
// types //
import type { BlogPostData } from "../../redux/_types/blog_posts/dataTypes";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";
import { formatTimeString, trimStringToSpecificLength, capitalizeString } from "../_helpers/displayHelpers";

interface IBlogMainViewProps {
  blogPosts: BlogPostData[];
  navigateToBlogPost(blogPostId: string): void;
}
export const BlogMainView: React.FC<IBlogMainViewProps> = ({ blogPosts, navigateToBlogPost }): JSX.Element | null => {
  // local state and hooks //
  // custom hooks //
  const { width } = useWindowSize();
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
      <Grid.Column className={ styles.blogEntryColumn } computer={ 10 } tablet= { 8 } mobile= { 16 }>
        <Card.Group className={ styles.cardGroup }>
          <Card className={ styles.mainCard } fluid={ width > 600 ? true : false }>
            <Image src="/images/blog1.jpg" size="large" alt="image" />
            <Card.Content>
              <Card.Header>{ blogPosts[0].title }</Card.Header>
              <Card.Description>
                <Label color="purple" content={`Author: ${ blogPosts[0].author }`} icon="user" />
              </Card.Description>
              <Card.Meta style={{ marginTop: "5px" }}>
                <Label color="teal" content={ ` Posted at: ` } icon="clock" />
                <span className={ styles.dateSpan }>{formatTimeString(blogPosts[0].createdAt, { yearMonth: true })}</span>
                <Label content={ ` ${capitalizeString(blogPosts[0].category)}` } icon="tag" />
              </Card.Meta>
              <Card.Description>{ trimStringToSpecificLength(blogPosts[0].content, 400) }</Card.Description>
            </Card.Content>
            <Card.Content>
              <Button basic color="pink" onClick={ () => navigateToBlogPost(blogPosts[0]._id) } content="Read..." />
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