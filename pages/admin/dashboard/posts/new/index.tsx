import * as React from 'react';
import { Grid } from "semantic-ui-react";
// next //
import { useRouter } from "next/router";
// redux and actions //
import { useDispatch, useSelector } from 'react-redux';
import { handleSaveNewBlogPost } from "../../../../../redux/actions/blogPostActions";
// additional components //
import { AdminLayout } from '../../../../../components/admin/AdminLayout';
import { PostForm } from "../../../../../components/admin/forms/PostForm";
import { AdminPostNav } from '../../../../../components/admin/posts/AdminPostNav';
import { AdminPostPreview } from '../../../../../components/admin/posts/AdminPostPreview';
// types //
import type { IGeneralState } from '../../../../../redux/_types/generalTypes';
// styles //
import adminNewPostsStyle from "../../../../../styles/admin/AdminNewPost.module.css";
import { blogPostValidator } from '../../../../../components/_helpers/validators';

interface IAdminNewViewProps {

}


type PostFormState = {
  postTitle: string;
  postAuthor: string;
  postKeywords: string;
  postCategory: string;
  postContent: string;
}

const AdminNewPost: React.FunctionComponent<IAdminNewViewProps> = (props): JSX.Element => {
  const [ postFormState, setPostFormState ] = React.useState<PostFormState>({ postTitle: "", postAuthor: "", postKeywords: "", postCategory: "", postContent: "" });
  const router = useRouter();
  const dispatch = useDispatch();
  const { blogPostsState } = useSelector((state: IGeneralState) => state);
  // actions //
  const cancelNewPost = (): void => {
    router.push("/admin/dashboard/posts");
  };
  const saveNewPost = async (): Promise<any> => {
    const { postTitle: title, postAuthor: author, postCategory: category, postContent: content } = postFormState;
    const keywords: string[] = postFormState.postKeywords ? postFormState.postKeywords.split(",") : [];
    // first validate on client side //
    const { valid, errorMessages } = blogPostValidator({ title, author, category, keywords, content });
    // TODO //
    // show an error div //
    if (valid) {
      try {
        return await handleSaveNewBlogPost(dispatch, { title, author, category, keywords, content}, blogPostsState);
      } catch (err) {
        console.log(err)
      }
    } 
    
  };
  // form listeners to update both form and preview //
  const updateTitle = (postTitle: string): void => {
    setPostFormState({ ...postFormState, postTitle });
  };
  const updateAuthor = (postAuthor: string): void => {
    setPostFormState({ ...postFormState, postAuthor });
  };
  const updateKeywords = (postKeywords: string): void => {
    setPostFormState({ ...postFormState, postKeywords });
  };
  const updateCategory = (postCategory: string): void => {
    setPostFormState({ ...postFormState, postCategory});
  }
  const updateContent = (postContent: string): void => {
    setPostFormState({ ...postFormState, postContent });
  };

  return (
    <AdminLayout>
      <Grid.Row className={ adminNewPostsStyle.navRow }>
        <AdminPostNav 
          savePost={ saveNewPost }
          cancelNewPost={ cancelNewPost } 
        />
      </Grid.Row>
      <Grid.Row className={ adminNewPostsStyle.previewRow }>
        <Grid.Column width={ 8 } style={{ height: "100%", overflowY: "scroll" }}>
          <PostForm 
            updateTitle={ updateTitle }
            updateAuthor={ updateAuthor }
            updateKeywords={ updateKeywords }
            updateCategory={ updateCategory }
            updateContent={ updateContent }
          />
        </Grid.Column>
        <Grid.Column width={ 8 } style={{ height: "100%" }}>
          <AdminPostPreview 
            { ...postFormState }
          />
        </Grid.Column>
      </Grid.Row>
    </AdminLayout>
  );
};

export default AdminNewPost;
