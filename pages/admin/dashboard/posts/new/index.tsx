import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additional components //
import { AdminLayout } from '../../../../../components/admin/AdminLayout';
import { PostForm } from "../../../../../components/admin/forms/PostForm";
import { AdminPostNav } from '../../../../../components/admin/posts/AdminPostNav';
import { AdminPostPreview } from '../../../../../components/admin/posts/AdminPostPreview';
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
  const [ postCategoriesArr, setPostCategoriesArr ] = React.useState<string[]>([]);

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

  React.useEffect(() => {
    setPostCategoriesArr(postFormState.postCategories.split(","));
  }, [ postFormState.postCategories ]);

  return (
    <AdminLayout>
      <Grid.Row className={ adminNewPostsStyle.navRow }>
        <AdminPostNav />
      </Grid.Row>
      <Grid.Row className={ adminNewPostsStyle.previewRow }>
        <Grid.Column width={ 8 } style={{ height: "100%" }}>
          <PostForm 
            updateTitle={ updateTitle }
            updateAuthor={ updateAuthor }
            updateCategories={ updateCategories }
            updateContent={ updateContent }
          />
        </Grid.Column>
        <Grid.Column width={ 8 } style={{ height: "100%" }}>
          <AdminPostPreview 
            postCategoriesArr={ postCategoriesArr } 
            { ...postFormState }
          />
        </Grid.Column>
      </Grid.Row>
    </AdminLayout>
  );
};

export default AdminNewPost;
