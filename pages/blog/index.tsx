import React from "react";
import { Grid } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { BlogMainView } from "../../components/blog/BlogMainView";
import { BlogHeader } from "../../components/blog/BlogHeader";
import { BlogSideView } from "../../components/blog/BlogSideView";
// redux actions //
import { handleFetchBlogPosts } from "../../redux/actions/blogPostActions";
// styles //
import blogMainStyle from "../../styles/blog/BlogMainStyle.module.css";
// types //
import type { IGeneralState } from "../../redux/_types/generalTypes";

const BlogPage: React.FC<{}> = (): JSX.Element => {

  const dispatch = useDispatch();
  const { blogPosts } = useSelector((state: IGeneralState) => state.blogPostsState)

  React.useEffect(() => {
    if (dispatch) handleFetchBlogPosts(dispatch);
  }, [ dispatch ]);

  return (
    <React.Fragment>
      <BlogHeader />
      <Grid.Row className={ blogMainStyle.blogPageRow }>
        <BlogSideView blogPosts={ blogPosts } />
        <BlogMainView blogPosts={ blogPosts.length > 3 ? blogPosts.slice(0, 4) : blogPosts }/>
      </Grid.Row>
    </React.Fragment>
  );
};

export default BlogPage;