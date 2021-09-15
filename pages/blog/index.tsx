import React from "react";
import { Grid } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { BlogMainView } from "../../components/blog/BlogMainView";
import { BlogHeader } from "../../components/blog/BlogHeader";
import { BlogSideView } from "../../components/blog/BlogSideView";
// redux actions //
import { wrapper } from "../../redux/store";
import { handleFetchBlogPosts } from "../../redux/actions/blogPostActions";
// styles //
import blogMainStyle from "../../styles/blog/BlogMainStyle.module.css";
// types //
import type { IGeneralState } from "../../redux/_types/generalTypes";
import type { BlogPostData } from "../../redux/_types/blog_posts/dataTypes";

export const getServerSideProps = wrapper.getServerSideProps((store) => async() => {
  /*
  const conf: AxiosRequestConfig = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    url: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/posts`
  }
  const res = await axios(conf);
  const { responseMsg, blogPosts }= res.data as { responseMsg: string; blogPosts: BlogPostData[] };
  */
 const dispatch = store.dispatch;
 await handleFetchBlogPosts(dispatch)
  return {
    props: { } 
  };
});
interface IServerSideProps {
  blogPosts: BlogPostData[];
}
interface IBlogPageProps extends IServerSideProps {

}
const BlogPage: React.FC<IBlogPageProps> = ({ }): JSX.Element => {

  const dispatch = useDispatch();
  const { blogPosts } = useSelector((state: IGeneralState) => state.blogPostsState)
  /*
  React.useEffect(() => {
    if (dispatch) handleFetchBlogPosts(dispatch);
  }, [ dispatch ]);
  */

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