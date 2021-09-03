import React from "react";
import { Grid } from "semantic-ui-react";
import { BlogEntry } from "../components/blog/BlogEntry";
import { BlogView } from "../components/blog/BlogView";
import blogMainStyle from "../styles/BlogMainStyle.module.css";

const BlogPage: React.FC<{}> = (): JSX.Element => {


  return (
    <Grid.Row className={ blogMainStyle.blogPageRow }>
      <BlogView />
      <BlogEntry />
    </Grid.Row>
  )
};

export default BlogPage;