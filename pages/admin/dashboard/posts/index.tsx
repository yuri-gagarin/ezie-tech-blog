import * as React from 'react';
import { Button, Card, Grid, Segment } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { BlogPostActions } from "../../../../redux/actions/blogPostActions";
// additonal components //
import { AdminLayout } from '../../../../components/admin/AdminLayout';
import { BlogViewModal } from "../../../../components/admin/modals/BlogViewModal";
// types //
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Dispatch } from "redux";
import type { IGeneralState } from '../../../../redux/_types/generalTypes';
import type { BlogPostAction } from '../../../../redux/_types/blog_posts/actionTypes';
// styles //
import styles from "../../../../styles/admin/AdminPostsIndex.module.css";
// helpers //
import { verifyAdminToken } from "../../../../components/_helpers/adminComponentHelpers";
import { capitalizeString, formatTimeString, trimStringToSpecificLength } from "../../../../components/_helpers/displayHelpers";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const token = context.req["signedCookies"].JWTToken;
  let validAdmin: boolean;
  try {
    validAdmin = await verifyAdminToken(token);
  } catch (error) {
    console.log(error);
    validAdmin = false;
  }

  if (validAdmin) {
    return {
      props: { }
    };
  } else {
    return {
      redirect: {
        destination: "/not_allowed",
        statusCode: 301,
      },
      props: {
        errorMessages: [ "Not Logged in "] 
      }
    };
  }
};


interface IAdminPostsIndexProps {

}

const AdminPostsIndex: React.FunctionComponent<IAdminPostsIndexProps> = (props): JSX.Element => {
  // local component state //
  const [ viewModalState, setViewModalState ] = React.useState<{ modalOpen: boolean }>({ modalOpen: false });
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<BlogPostAction>>();
  const { blogPostsState } = useSelector((state: IGeneralState) => state);
  const { blogPosts, currentBlogPost } = blogPostsState;

  // action handlers //
  const toggleBlogPostModal = (blogPostId?: string): void => {
    if (blogPostId && !viewModalState.modalOpen) {
      BlogPostActions.handleSetCurrentBlogPost(dispatch, blogPostId, blogPostsState);
      setViewModalState({ ...viewModalState, modalOpen: true});
    } else { 
      BlogPostActions.handleClearCurrentBlogPost(dispatch);
      setViewModalState({ ...setViewModalState, modalOpen: false });
    }
  };
  const goToBlogPostEdit = (): void => {
    setViewModalState({ ...setViewModalState, modalOpen: false });
    router.push("/admin/dashboard/posts/new");
  };
  const triggerBlogPostDelete = async (): Promise<void> => {
    // TODO //
    // ideally a popup confirm modal should appear //
    try {
      const { _id: postId } = currentBlogPost;
      await BlogPostActions.handleDeleteBlogPost(dispatch, postId, blogPostsState);
      router.push("/admin/dashboard/posts");
    } catch (error) {
      console.log(error);
    }
  };

  // lifecycle hooks //
  React.useEffect(() => {
    BlogPostActions.handleFetchBlogPosts(dispatch);
  }, [ dispatch ]);

  return (
    <AdminLayout>
      <BlogViewModal 
        modalOpen={ viewModalState.modalOpen } 
        blogPostData={ currentBlogPost } 
        closeModal={ toggleBlogPostModal }
        goToBlogPostEdit={ goToBlogPostEdit }
        triggerBlogPostDelete={ triggerBlogPostDelete }
      />
      <Grid.Row className={ styles.headerRow }> 
        <Segment placeholder textAlign="center"  className={ styles.headerTitle }>
          <h3>All Blog Posts - Published and In Progress</h3>
        </Segment>
      </Grid.Row>
      <Grid.Row className={ styles.contentRow } centered>
        <Grid.Column largeScreen={15} mobile={16} >
          <Card.Group itemsPerRow="4" stackable>
          {
            blogPosts.map((blogPostData) => {
              return (
                <Card key={ blogPostData._id }>
                  <Card.Content>
                    <Card.Header>{ blogPostData.title }</Card.Header>
                    <Card.Meta>Created at: { formatTimeString(blogPostData.createdAt, { yearMonth: true }) }</Card.Meta>
                    <Card.Description>
                      <div dangerouslySetInnerHTML={{ __html: trimStringToSpecificLength(blogPostData.content, 200) }} />
                    </Card.Description>
                  </Card.Content>
                  <Card.Content>
                    <Card.Description>
                      Category: { capitalizeString(blogPostData.category) }
                    </Card.Description>
                  </Card.Content>
                  <Card.Content>
                    <Card.Meta>
                      Published: { blogPostData.published ? "Yes" : "No" }
                    </Card.Meta>
                    <Button color="green" content="View" onClick={ () => toggleBlogPostModal(blogPostData._id) } />
                  </Card.Content>
                </Card>
              )
            })
          }
          </Card.Group>
        </Grid.Column>
        
      </Grid.Row>
    </AdminLayout>     
  );
};

export default AdminPostsIndex;
