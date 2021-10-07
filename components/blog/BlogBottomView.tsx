import * as React from 'react';
import { Button, Card, Image, Label } from "semantic-ui-react";
// types //
import type { BlogPostData } from '@/redux/_types/blog_posts/dataTypes';
// styles //
import styles from "@/styles/blog/BlogBottomView.module.css";
// helpers //
import { trimStringToSpecificLength, capitalizeString, formatTimeString } from "../_helpers/displayHelpers";

interface IBlogBottomViewProps {
  blogPosts: BlogPostData[];
  navigateToBlogPost(blogPostId: string): void;
}

export const BlogBottomView: React.FunctionComponent<IBlogBottomViewProps> = ({ blogPosts, navigateToBlogPost }): JSX.Element | null => {
  return (
    blogPosts.length > 3 
    ?
    <Card.Group itemsPerRow={3} className={ styles.cardGroup } >
    {
      blogPosts.slice(1, 4).map((postData) => {
        return (
          <Card className={ styles.blogBottomCard } key={ postData._id }>
            <Image src="/images/blog1.jpg" alt="image" />
            <Card.Content>
              <Card.Header>{ postData.title }</Card.Header>
              <Card.Meta>
                <Label ribbon color="teal" content={` Posted at:`} icon="calendar" />
                <span className={ styles.dateSpan }>{ formatTimeString(postData.createdAt, { yearMonth: true })}</span>
              </Card.Meta>
              <Card.Description>
                <Label color="purple" content={` Author:`} icon="user" />
                <span className={ styles.authorSpan }>{ postData.author }</span>
              </Card.Description>
                <Label className={ styles.categoryLabel } content={ capitalizeString(postData.category) } icon="tag" />
              <Card.Description>
              </Card.Description>
              <Card.Description>
                { trimStringToSpecificLength(postData.content, 200) }
              </Card.Description>
              <Card.Description>
                <Button basic color="pink" content="Read" onClick={ () => navigateToBlogPost(postData._id) } />
              </Card.Description>
            </Card.Content>
          </Card>
        )
      })
    }
    </Card.Group>
    :
    null
  );
};

