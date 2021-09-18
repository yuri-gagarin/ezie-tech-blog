import React from "react";
import { Button, Card, Grid, Image } from "semantic-ui-react";
// additional components //
import { GeneralLoadingSegement } from "../loaders/GeneralLoadingSegment";
// styles //
import blogEntryStyle from "../../styles/blog/BlogMainView.module.css";
// types //
import type { BlogPostData } from "../../redux/_types/blog_posts/dataTypes";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";
import { formatTimeString, trimStringToSpecificLength, capitalizeString } from "../_helpers/displayHelpers";

interface IBlogMainViewProps {
  blogPosts: BlogPostData[];
  navigateToBlogPost(blogPostId: string): void;
}
export const BlogMainView: React.FC<IBlogMainViewProps> = ({ blogPosts, navigateToBlogPost }): JSX.Element => {
  // local state and hooks //
  // custom hooks //
  const { width } = useWindowSize();
  // lifecycle hooks //
  /*
  React.useEffect(() => {
    if (blogPosts.length > 0) setDefaultBlogPostData(setDefaultBlogPosts(blogPosts));
  }, [ blogPosts ]);
  */

  return (
    blogPosts.length > 0 
    ?
    <Grid.Column className={ blogEntryStyle.blogEntryColumn } largeScreen={ 11 } tablet= { 16 } mobile= { 16 }>
      <Card.Group className={ blogEntryStyle.cardGroup } centered={ width <  600 ? true : false }>
        <Card className={ blogEntryStyle.mainCard } fluid={ width > 600 ? true : false }>
          <Image src="/images/blog1.jpg" size="large" alt="image" />
          <Card.Content>
            <Card.Header>{ blogPosts[0].title }</Card.Header>
            <Card.Meta>Posted at: { formatTimeString(blogPosts[0].createdAt as string, { yearMonth: true })}</Card.Meta>
            <Card.Header>{ capitalizeString(blogPosts[0].category) }</Card.Header>
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
};