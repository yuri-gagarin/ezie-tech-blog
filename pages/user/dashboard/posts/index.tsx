import * as React from 'react';
import { Button, Card, Grid, Segment } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { BlogPostActions } from "@/redux/actions/blogPostActions";
// additonal components //
import { BlogViewModal } from "@/components/admin/modals/BlogViewModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
// types //
// import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Dispatch } from "redux";
import type { IGeneralState } from '@/redux/_types/generalTypes';
import type { BlogPostAction } from '@/redux/_types/blog_posts/actionTypes';
// styles //
import styles from "@/styles/user/UserPostsIndex.module.css";
// helpers //
// import { verifyUserToken } from "@/components/_helpers/userComponentHelpers";
import { capitalizeString, formatTimeString, trimStringToSpecificLength } from "@/components/_helpers/displayHelpers";

// TODO //
// this should verify a registered user //
/*
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const token = context.req["signedCookies"].JWTToken;
  let validUser: boolean;
  try {
    validUser = await verifyUserToken(token);
  } catch (error) {
    console.log(error);
    validUser = false;
  }

  if (validUser) {
    return {
      props: { }
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        statusCode: 301,
      },
      props: {
        errorMessages: [ "Not Logged in "] 
      }
    };
  }
};
*/

interface IUserPostsIndexProps {

}

type ModalState = {
  blogPostViewModalOpen: boolean;
  confirmDeleteModalOpen: boolean;
}

const UserPostsIndex: React.FunctionComponent<IUserPostsIndexProps> = (props): JSX.Element => {
  // local component state //
  const [ modalState, setModalState ] = React.useState<ModalState>({ blogPostViewModalOpen: false, confirmDeleteModalOpen: false });
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<BlogPostAction>>();
  const { blogPostsState, authState } = useSelector((state: IGeneralState) => state);
  const { blogPosts, currentBlogPost } = blogPostsState;

  // action handlers //
  const toggleBlogPostModal = (blogPostId?: string): void => {
    if (blogPostId && !modalState.blogPostViewModalOpen) {
      BlogPostActions.handleSetCurrentBlogPost(dispatch, blogPostId, blogPostsState);
      setModalState((s) => ({ ...s, blogPostViewModalOpen: true }));
    } else { 
      BlogPostActions.handleClearCurrentBlogPost(dispatch);
      setModalState((s) => ({ ...s, blogPostViewModalOpen: false }));
    }
  };
  const goToBlogPostEdit = (): void => {
    setModalState((s) => ({ ...s, blogPostViewModalOpen: false }));
    router.push("/user/dashboard/posts/editor");
  };
  // 
  const triggerBlogPostDelete = async (): Promise<void> => {
    setModalState((s) => ({ ...s, confirmDeleteModalOpen: true }));
  };
  const cancelBlogPostDelete = (): void => {
    setModalState((s) => ({ ...s, confirmDeleteModalOpen: false }));
  };
  const handleDeleteBlogPost = async (): Promise<any> => {
    try {
      const { _id: modelId } = currentBlogPost;
      const {authToken: JWTToken } = authState;
      await BlogPostActions.handleDeleteBlogPost({ dispatch, JWTToken, modelId, state: blogPostsState });
      setModalState((s) => ({ ...s, confirmDeleteModalOpen: false, blogPostViewModalOpen: false }));
    } catch (error) {
      BlogPostActions.handleBlogPostError(dispatch, error);
    }
  };

  // lifecycle hooks //
  React.useEffect(() => {
    const { authToken: JWTToken } = authState;
    const fetchAsyncData = async () => {
      try {
        // await BlogPostActions.handleFetchBlogPosts(dispatch, { limit: 20, createdAt: "desc", publishedStatus: "all" }, { JWTToken } );
      } catch (error) {
        BlogPostActions.handleBlogPostError(dispatch, error);
      }
    } 
    fetchAsyncData();
  }, [ dispatch ]);

  return (
    <React.Fragment>
      <BlogViewModal 
        modalOpen={ modalState.blogPostViewModalOpen } 
        blogPostData={ currentBlogPost } 
        closeModal={ toggleBlogPostModal }
        goToBlogPostEdit={ goToBlogPostEdit }
        triggerBlogPostDelete={ triggerBlogPostDelete }
      />
      <ConfirmDeleteModal
        modalOpen={ modalState.confirmDeleteModalOpen }
        handleCloseModal={ cancelBlogPostDelete }
        handleModelDelete={ handleDeleteBlogPost }
      />
      <Grid.Row className={ styles.headerRow }> 
        <Segment placeholder textAlign="center"  className={ styles.headerTitle }>
          <h3>All Blog Posts - Published and In Progress</h3>
        </Segment>
      </Grid.Row>
      <Grid.Row className={ styles.contentRow } centered data-test-id="dash-blog-posts-page">
        <Grid.Column largeScreen={15} mobile={16} >
          <Card.Group itemsPerRow="4" stackable>
          {
            blogPosts.map((blogPostData) => {
              return (
                <Card key={ blogPostData._id } data-test-id="dash-blog-post-card">
                  <Card.Content>
                    <Card.Header data-test-id="dash-blog-post-card-title">{ blogPostData.title }</Card.Header>
                    <Card.Meta data-test-id="dash-blog-post-card-created">Created at: { formatTimeString(blogPostData.createdAt, { yearMonth: true }) }</Card.Meta>
                    <Card.Description data-test-id="dash-blog-post-card-content">
                      <div dangerouslySetInnerHTML={{ __html: trimStringToSpecificLength(blogPostData.content, 200) }} />
                    </Card.Description>
                  </Card.Content>
                  <Card.Content>
                    <Card.Description data-test-id="dash-blog-post-card-category">
                      Category: { capitalizeString(blogPostData.category) }
                    </Card.Description>
                  </Card.Content>
                  <Card.Content>
                    <Card.Meta data-test-id="dash-blog-post-card-published">
                      Published: { blogPostData.published ? "Yes" : "No" }
                    </Card.Meta>
                    <Button color="green" content="View" onClick={ () => toggleBlogPostModal(blogPostData._id) } data-test-id="dash-blog-post-card-view-btn" />
                  </Card.Content>
                </Card>
              )
            })
          }
          </Card.Group>
        </Grid.Column>
        
      </Grid.Row>
    </React.Fragment>     
  );
};

export default UserPostsIndex;
