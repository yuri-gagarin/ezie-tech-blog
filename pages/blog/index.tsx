import React from "react";
import { Grid } from "semantic-ui-react";
import Head from "next/head";
// redux and actions //
import { useDispatch, useSelector } from "react-redux";
import { handleSetCurrentBlogPost } from "../../redux/actions/blogPostActions";
// additional components //
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
import { useRouter } from "next/router";

export const getServerSideProps = wrapper.getServerSideProps((store) => async() => {
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
const BlogMainIndexPage: React.FC<IBlogPageProps> = ({ }): JSX.Element => {

  const router = useRouter();
  const dispatch = useDispatch();
  const blogPostState = useSelector((state: IGeneralState) => state.blogPostsState)
  const { blogPosts } = blogPostState;
  // action handlers //

  const navigateToBlogPost = (blogPostId: string): void => {
    const currentPost: BlogPostData = handleSetCurrentBlogPost(dispatch, blogPostId, blogPostState);
    router.push(`/blog/${currentPost.slug}`);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Ezie Blog - Dont Panic!</title>
      </Head>
      <BlogHeader />
      <Grid.Row className={ blogMainStyle.blogPageRow }>
        <BlogSideView 
          blogPosts={ blogPosts } 
          navigateToBlogPost={ navigateToBlogPost }
        />
        <BlogMainView 
          blogPosts={ blogPosts.length > 3 ? blogPosts.slice(0, 4) : blogPosts }
          navigateToBlogPost={ navigateToBlogPost }
        />
      </Grid.Row>
    </React.Fragment>
  );
};

export default BlogMainIndexPage;