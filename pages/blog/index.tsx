import React from "react";
import { Grid } from "semantic-ui-react";
import { BlogEntry } from "../../components/blog/BlogEntry";
import { BlogHeader } from "../../components/blog/BlogHeader";
import { BlogView } from "../../components/blog/BlogView";
// styles //
import blogMainStyle from "../../styles/blog/BlogMainStyle.module.css";

const BlogPage: React.FC<{}> = (): JSX.Element => {


  return (
    <React.Fragment>
      <BlogHeader />
      <Grid.Row className={ blogMainStyle.blogPageRow }>
        <BlogView />
        <BlogEntry />
      </Grid.Row>
    </React.Fragment>
  );
};

export default BlogPage;