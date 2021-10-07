import * as React from 'react';
import { Container, Grid } from "semantic-ui-react";
// additional components //
import { BlogBottomView } from "@/components/blog/BlogBottomView"; 
// types //
import type { BlogPostData } from '@/redux/_types/blog_posts/dataTypes';

interface IHomeLatestBlogProps {
  blogPostsArr: BlogPostData[];
  navigateToBlogPost(blogPostId: string): void;
}

export const HomeLatestBlog: React.FunctionComponent<IHomeLatestBlogProps> = ({ blogPostsArr, navigateToBlogPost }): JSX.Element => {
  return (
    <Grid.Row>
      <Container>
        <BlogBottomView 
          blogPosts={ blogPostsArr }
          navigateToBlogPost={ navigateToBlogPost }
        />
      </Container>
    </Grid.Row>
  );
};

