import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additional components //
import { AdminLayout } from '../../../../../components/admin/AdminLayout';
import { PostForm } from "../../../../../components/admin/forms/PostForm";
// types //
// styles //
import adminNewPostsStyle from "../../../../../styles/admin/AdminNewPost.module.css";

interface IAdminNewViewProps {

}


type PostFormState = {
  postTitle: string;
  postAuthor: string;
  postCategories: string;
  postContent: string;
}

const AdminNewPost: React.FunctionComponent<IAdminNewViewProps> = (props): JSX.Element => {
  const [ postFormState, setPostFormState ] = React.useState<PostFormState>({ postTitle: "", postAuthor: "", postCategories: "", postContent: "" });

  const updateTitle = (postTitle: string): void => {
    setPostFormState({ ...postFormState, postTitle });
  };
  const updateAuthor = (postAuthor: string): void => {
    setPostFormState({ ...postFormState, postAuthor });
  };
  const updateCategories = (postCategories: string): void => {
    setPostFormState({ ...postFormState, postCategories });
  };
  const updateContent = (postContent: string): void => {
    setPostFormState({ ...postFormState, postContent });
  };

  return (
    <AdminLayout>
      <Grid.Row className={ adminNewPostsStyle.previewRow }>
        <Grid.Column width={ 8 }>
          <PostForm 
            updateTitle={ updateTitle }
            updateAuthor={ updateAuthor }
            updateCategories={ updateCategories }
            updateContent={ updateContent }
          />
        </Grid.Column>
        <Grid.Column width={ 8 }>

        </Grid.Column>
      </Grid.Row>
    </AdminLayout>
  );
};

export default AdminNewPost;
