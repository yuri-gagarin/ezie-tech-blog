import * as React from 'react';
import { Button, Grid } from "semantic-ui-react";
// additional components //
import { BlogBottomView } from "@/components/blog/BlogBottomView"; 
// types //
import type { BlogPostData } from '@/redux/_types/blog_posts/dataTypes';
// styles //
import styles from "@/styles/home/HomeLatestBlog.module.css";

interface IHomeLatestBlogProps {
  blogPostsArr: BlogPostData[];
  navigateToBlogPost(blogPostId: string): void;
  navigateToBlogsPage(): void;
}

export const HomeLatestBlog = React.forwardRef<HTMLDivElement, IHomeLatestBlogProps>(({ blogPostsArr, navigateToBlogPost, navigateToBlogsPage }, ref) => {
  return (
    <>
      <Grid.Row className={ styles.latestBlogRow }>
        <div className={ styles.latestBlogWrapper } ref={ ref }>
          <BlogBottomView 
            blogPosts={ blogPostsArr }
            navigateToBlogPost={ navigateToBlogPost }
          />
        </div>
      </Grid.Row>
      <Grid.Row>
        <div className={ styles.techBlogBtnOuter }>
          <div className={ styles.techBlogBtnInner }>
            <Button fluid color="purple" content="All Blog Posts" onClick={ navigateToBlogsPage } />
          </div>
        </div>  
      </Grid.Row>
    </>
  );
});
HomeLatestBlog.displayName = 'HomeLatesBlog';


