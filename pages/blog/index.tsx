import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
// next //
import Head from "next/head";
import { useRouter } from "next/router";
// redux and actions //
import { wrapper } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { handleSetCurrentBlogPost, handleFetchBlogPosts } from "../../redux/actions/blogPostActions";
// additional components //
import { BlogMainView } from "../../components/blog/BlogMainView";
import { BlogHeader } from "../../components/blog/BlogHeader";
import { BlogSideView } from "../../components/blog/BlogSideView";
import { BlogBottomView } from "../../components/blog/BlogBottomView";
import { GeneralNotImlementedModal } from "../../components/modals/GenNotImplementedModal";
// styles //
import blogMainStyle from "../../styles/blog/BlogMainStyle.module.css";
// types //
import type { IGeneralState } from "../../redux/_types/generalTypes";
import type { BlogPostData, SearchCategories } from "../../redux/_types/blog_posts/dataTypes";

// TODO edit for a sercer side call later //
/*
export const getServerSideProps = wrapper.getServerSideProps((store) => async() => {
 const dispatch = store.dispatch;
 await handleFetchBlogPosts(dispatch)
  return {
    props: { } 
  };
});
*/


interface IServerSideProps {
  blogPosts: BlogPostData[];
}
interface IBlogPageProps extends IServerSideProps {

}
const BlogMainIndexPage: React.FC<IBlogPageProps> = ({ }): JSX.Element => {
  // local state and hooks //
  const [ genNotImpModalState, setGenNotImpModalState ] = React.useState<boolean>(false);
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch();
  const blogPostState = useSelector((state: IGeneralState) => state.blogPostsState)
  const { blogPosts } = blogPostState;

  // action handlers //
  const navigateToBlogPost = (blogPostId: string): void => {
    const currentPost: BlogPostData = handleSetCurrentBlogPost(dispatch, blogPostId, blogPostState);
    router.push(`/blog/${currentPost.slug}`);
  };
  const handleBlogPostSort = async ({ category, date, popularity }: { category?: SearchCategories; date?: "asc" | "desc"; popularity?: string }): Promise<any> => {
    if (category) return handleFetchBlogPosts(dispatch, { category })
  };
  const handleBlogPostLike = async (blogPostId: string) => {
    // NOT IMPLEMENTED YET //
    setGenNotImpModalState(true);
  };
  const dismissNotImpModal = (): void => {
    setGenNotImpModalState(false);
  }
  
  React.useEffect(() => {
    handleFetchBlogPosts(dispatch);
  }, [ dispatch ]);

  return (
    <React.Fragment>
      <GeneralNotImlementedModal modalOpen={ genNotImpModalState } dismissNotImpModal={ dismissNotImpModal } />
      <Head>
        <title>Ezie Blog - Dont Panic!</title>
      </Head>
      <BlogHeader />
      <Grid.Row className={ blogMainStyle.blogPageRow } centered>
        <BlogSideView 
          blogPosts={ blogPosts } 
          navigateToBlogPost={ navigateToBlogPost }
          handleBlogPostSort={ handleBlogPostSort }
          handleBlogPostLike={ handleBlogPostLike }
        />
        <BlogMainView 
          blogPosts={ blogPosts }
          navigateToBlogPost={ navigateToBlogPost }
          handleBlogPostLike={ handleBlogPostLike }
        />
      </Grid.Row>
      <Grid.Row className={ blogMainStyle.blogBottomRow} centered>
        <Grid.Column largeScreen={12} tablet={14} mobile={16}>
          <Segment textAlign="center" className={ blogMainStyle.bottomRowTitle }>Read More</Segment>
          <BlogBottomView blogPosts={ blogPosts } navigateToBlogPost={ navigateToBlogPost } />
        </Grid.Column>
      </Grid.Row>
    </React.Fragment>
  );
};

export default BlogMainIndexPage;