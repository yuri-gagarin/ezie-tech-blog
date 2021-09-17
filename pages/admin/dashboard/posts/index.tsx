import * as React from 'react';
import { Button, Card, Grid, Segment } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { handleClearCurrentBlogPost, handleFetchBlogPosts, handleSetCurrentBlogPost } from "../../../../redux/actions/blogPostActions";
// additonal components //
import { AdminLayout } from '../../../../components/admin/AdminLayout';
import { BlogViewModal } from "../../../../components/admin/modals/BlogViewModal";
// types //
import { IGeneralState } from '../../../../redux/_types/generalTypes';
// styles //
import styles from "../../../../styles/admin/AdminPostsIndex.module.css";
import { BlogPostAction } from '../../../../redux/_types/blog_posts/actionTypes';
// helpers //
import { capitalizeString, formatTimeString, trimStringToSpecificLength } from "../../../../components/_helpers/displayHelpers";
interface IAdminPostsIndexProps {

}

/// TODO //
// CREATE A LAYOUT FOR ADMIN //

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
      handleSetCurrentBlogPost(dispatch, blogPostId, blogPostsState);
      setViewModalState({ ...viewModalState, modalOpen: true});
    } else { 
      handleClearCurrentBlogPost(dispatch);
      setViewModalState({ ...setViewModalState, modalOpen: false });
    }
  };
  const goToBlogPostEdit = (): void => {
    setViewModalState({ ...setViewModalState, modalOpen: false });
    router.push("/admin/dashboard/posts/new");
  }

  // lifecycle hooks //
  React.useEffect(() => {
    handleFetchBlogPosts(dispatch);
  }, [ dispatch ]);

  return (
    <AdminLayout>
      <BlogViewModal 
        modalOpen={ viewModalState.modalOpen } 
        blogPostData={ currentBlogPost } 
        closeModal={ toggleBlogPostModal }
        goToBlogPostEdit={ goToBlogPostEdit }
      />
      <Grid.Row className={ styles.headerRow }> 
        <Segment placeholder textAlign="center"  className={ styles.headerTitle }>
          <h3>All Blog Posts - Published and In Progress</h3>
        </Segment>
      </Grid.Row>
      <Grid.Row  className={ styles.contentRow }>
        <Card.Group itemsPerRow="4">
         {
           blogPosts.map((blogPostData) => {
             return (
              <Card key={ blogPostData._id } fluid>
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
                    Published: { blogPostData.live ? "Yes" : "No" }
                  </Card.Meta>
                  <Button color="green" content="View" onClick={ () => toggleBlogPostModal(blogPostData._id) } />
                </Card.Content>
              </Card>
             )
           })
         }
        </Card.Group>
      </Grid.Row>
    </AdminLayout>     
  );
};

export default AdminPostsIndex;
