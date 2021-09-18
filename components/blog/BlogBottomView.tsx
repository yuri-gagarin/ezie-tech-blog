import * as React from 'react';
import { Button, Card, Image } from "semantic-ui-react";
// types //
import type { BlogPostData } from '../../redux/_types/blog_posts/dataTypes';
// styles //
import styles from "../../styles/blog/BlogBottomView.module.css";
// helpers //
import { trimStringToSpecificLength, capitalizeString, formatTimeString } from "../_helpers/displayHelpers";

interface IBlogBottomViewProps {
  blogPosts: BlogPostData[]
}

export const BlogBottomView: React.FunctionComponent<IBlogBottomViewProps> = ({ blogPosts }): JSX.Element | null => {
  return (
    blogPosts.length > 3 
    ?
    <Card.Group centered itemsPerRow={3}>
    {
      blogPosts.slice(1, 4).map((postData) => {
        return (
          <Card className={ styles.blogBottomCard } key={ postData._id }>
            <Image src="/images/blog1.jpg" alt="image" />
            <Card.Content>
              <Card.Header>{ postData.title }</Card.Header>
              <Card.Meta>Posted at: { formatTimeString(postData.createdAt, { yearMonth: true })}</Card.Meta>
              <Card.Header>{ capitalizeString(postData.category) }</Card.Header>
              <Card.Description>
                { trimStringToSpecificLength(postData.content, 200) }
              </Card.Description>
              <Card.Description>
                <Button basic color="pink" content="Read" />
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

