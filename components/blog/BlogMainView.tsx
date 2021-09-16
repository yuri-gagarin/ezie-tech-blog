import React from "react";
import { Button, Card, Grid, Image } from "semantic-ui-react";
// styles //
import blogEntryStyle from "../../styles/blog/BlogMainView.module.css";
// types //
import type { BlogPostData } from "../../redux/_types/blog_posts/dataTypes";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";
import { setDefaultBlogPosts, formatTimeString, trimStringToSpecificLength, capitalizeString } from "../_helpers/displayHelpers";

interface IBlogMainViewProps {
  blogPosts: BlogPostData[];
  navigateToBlogPost(blogPostId: string): void;
}
export const BlogMainView: React.FC<IBlogMainViewProps> = ({ blogPosts, navigateToBlogPost }): JSX.Element => {
  const [ defaultBlogPostData, setDefaultBlogPostData ] = React.useState<BlogPostData[]>(setDefaultBlogPosts(blogPosts));
  const { width } = useWindowSize();

  React.useEffect(() => {
    if (blogPosts.length > 0) setDefaultBlogPostData(setDefaultBlogPosts(blogPosts));
  }, [ blogPosts ]);

  return (
    <Grid.Column className={ blogEntryStyle.blogEntryColumn } largeScreen={ 12 } tablet= { 16 } mobile= { 16 }>
      <Card.Group className={ blogEntryStyle.cardGroup } centered={ width <  600 ? true : false }>
        <Card raised fluid={ width > 600 ? true : false }>
          <Image src="/images/blog1.jpg" size="large" alt="image" />
          <Card.Content>
            <Card.Header>{ defaultBlogPostData[0].title }</Card.Header>
            <Card.Meta>Posted at: { formatTimeString(defaultBlogPostData[0].createdAt as string, { yearMonth: true })}</Card.Meta>
            <Card.Header>{ capitalizeString(defaultBlogPostData[0].category) }</Card.Header>
            <Card.Description>{ trimStringToSpecificLength(defaultBlogPostData[0].content, 400) }</Card.Description>
          </Card.Content>
          <Card.Content>
            <Button onClick={ () => navigateToBlogPost(defaultBlogPostData[0]._id) } content="Read..." />
          </Card.Content>
        </Card>
      </Card.Group>
      <Card.Group centered itemsPerRow={3}>
        <Card raised>
          <Image src="/images/blog1.jpg" alt="image" />
          <Card.Content>
            <Card.Header>{ defaultBlogPostData[1].title }</Card.Header>
            <Card.Meta>Posted at: { formatTimeString(defaultBlogPostData[1].createdAt as string, { yearMonth: true })}</Card.Meta>
            <Card.Header>{ capitalizeString(defaultBlogPostData[1].category) }</Card.Header>
            <Card.Description>
              { trimStringToSpecificLength(defaultBlogPostData[1].content, 200) }
              <span>Read</span>
            </Card.Description>
          </Card.Content>
        </Card>
        <Card raised>
          <Image src="/images/blog1.jpg" alt="image" />
          <Card.Content>
            <Card.Header>{ defaultBlogPostData[2].title }</Card.Header>
            <Card.Meta>Posted at: { formatTimeString(defaultBlogPostData[2].createdAt as string, { yearMonth: true })}</Card.Meta>
            <Card.Header>{ capitalizeString(defaultBlogPostData[2].category) }</Card.Header>
            <Card.Description>
              { trimStringToSpecificLength(defaultBlogPostData[2].content, 200) }
              <span>Read</span>
            </Card.Description>
          </Card.Content>
        </Card>
        <Card raised>
          <Image src="/images/blog1.jpg" alt="image" />
          <Card.Content>
            <Card.Header>{ defaultBlogPostData[3].title }</Card.Header>
            <Card.Meta>Posted at: { formatTimeString(defaultBlogPostData[3].createdAt as string, { yearMonth: true })}</Card.Meta>
            <Card.Header>{ capitalizeString(defaultBlogPostData[3].category) }</Card.Header>
            <Card.Description>
              { trimStringToSpecificLength(defaultBlogPostData[3].content, 200) }
              <span>Read</span>
            </Card.Description>
          </Card.Content>
        </Card>
      </Card.Group>
    </Grid.Column>
  );
};