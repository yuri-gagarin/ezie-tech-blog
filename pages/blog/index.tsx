import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
// next //
import Head from "next/head";
import { useRouter } from "next/router";
// redux and actions //
import { wrapper } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { BlogPostActions } from "@/redux/actions/blogPostActions";
// additional components //
import { BlogMainView } from "@/components/blog/BlogMainView";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogSideView } from "@/components/blog/BlogSideView";
import { BlogBottomView } from "@/components/blog/BlogBottomView";
import { GeneralNotImlementedModal } from "@/components/modals/GenNotImplementedModal";
import { NeedLoginModal } from "@/components/modals/NeedLoginModal";
// styles //
import blogMainStyle from "@/styles/blog/BlogMainStyle.module.css";
// types //
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { BlogPostData, SearchCategories } from "@/redux/_types/blog_posts/dataTypes";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";

export const getServerSideProps = wrapper.getServerSideProps((store) => async(context) => {
  const dispatch = store.dispatch;
  await BlogPostActions.handleFetchBlogPosts(dispatch)
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
  // local state and hooks //
  const [ genNotImpModalState, setGenNotImpModalState ] = React.useState<boolean>(false);
  const [ needLoginModalState, setNeedLoginModalState ] = React.useState<boolean>(false);
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch();
  const { authState, blogPostsState } = useSelector((state: IGeneralState) => state);
  const { blogPosts } = blogPostsState;
  const { currentUser, loggedIn, authToken } = authState;
  // custom hooks //
  const { width } = useWindowSize();

  // action handlers //
  const navigateToBlogPost = (blogPostId: string): void => {
    const currentPost: BlogPostData = BlogPostActions.handleSetCurrentBlogPost(dispatch, blogPostId, blogPostsState);
    router.push(`/blog/${currentPost.slug}`);
  };
  const handleBlogPostSort = async ({ category, date, popularity }: { category?: SearchCategories; date?: "asc" | "desc"; popularity?: string }): Promise<any> => {
    if (category) return BlogPostActions.handleFetchBlogPosts(dispatch, { category })
  };
  const handleBlogPostLike = async (blogPostId: string): Promise<any> => {
    if (loggedIn || authToken) {
      try {
        return await BlogPostActions.handleToggleBlogPostLike(dispatch, blogPostId, authToken, blogPostsState);
      } catch (error) {
        return BlogPostActions.handleBlogPostError(dispatch, error);
      }
    } else {
      return setNeedLoginModalState(true);
    }
  };

  const dismissNotImpModal = (): void => {
    setGenNotImpModalState(false);
  };
  const dismissNeedLoginModal = (): void => {
    setNeedLoginModalState(false);
  };
  
  // END action handlers //

  return (
    <React.Fragment>
      <GeneralNotImlementedModal modalOpen={ genNotImpModalState } dismissNotImpModal={ dismissNotImpModal } />
      <NeedLoginModal modalOpen={ needLoginModalState } handleCloseModal={ dismissNeedLoginModal } /> 
      <Head>
        <title>Ezie Blog - Dont Panic!</title>
      </Head>
      <BlogHeader />
      <Grid.Row className={ blogMainStyle.blogPageRow } centered>
        <BlogSideView 
          blogPosts={ blogPosts } 
          currentUserData={ currentUser }
          navigateToBlogPost={ navigateToBlogPost }
          handleBlogPostSort={ handleBlogPostSort }
          handleBlogPostLike={ handleBlogPostLike }
        />
        <BlogMainView 
          blogPosts={ blogPosts }
          currentUserData={ currentUser }
          navigateToBlogPost={ navigateToBlogPost }
          handleBlogPostLike={ handleBlogPostLike }
        />
      </Grid.Row>
      {
        width > 550 
        ?
        <Grid.Row className={ blogMainStyle.blogBottomRow} centered>
          <Grid.Column largeScreen={12} tablet={14} mobile={16}>
            <Segment textAlign="center" className={ blogMainStyle.bottomRowTitle }>Read More</Segment>
            <BlogBottomView blogPosts={ blogPosts } navigateToBlogPost={ navigateToBlogPost } />
          </Grid.Column>
        </Grid.Row>
        :
        null
      }
      
    </React.Fragment>
  );
};

export default BlogMainIndexPage;