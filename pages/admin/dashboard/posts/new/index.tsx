import * as React from 'react';
import { Grid } from "semantic-ui-react";
// next //
import { useRouter } from "next/router";
// redux and actions //
import { useDispatch, useSelector } from 'react-redux';
import { BlogPostActions } from "../../../../../redux/actions/blogPostActions";
// additional components //
import { AdminLayout } from '../../../../../components/admin/AdminLayout';
import { PostForm } from "../../../../../components/admin/forms/PostForm";
import { AdminPostNav } from '../../../../../components/admin/posts/AdminPostNav';
import { AdminPostPreview } from '../../../../../components/admin/posts/AdminPostPreview';
// types //
import type { IGeneralState } from '../../../../../redux/_types/generalTypes';
// styles //
import adminNewPostsStyle from "../../../../../styles/admin/AdminNewPost.module.css";
// helpers //
import { blogPostValidator } from '../../../../../components/_helpers/validators';
import { capitalizeString } from '@/components/_helpers/displayHelpers';
import { IAuthState } from '@/redux/_types/auth/dataTypes';

interface IAdminNewViewProps {

}
export type PostFormState = {
  postTitle: string;
  postKeywords: string;
  postCategory: string;
  postContent: string;
}

const AdminNewPost: React.FunctionComponent<IAdminNewViewProps> = (props): JSX.Element => {
  // local component hooks and state //
  const [ postFormState, setPostFormState ] = React.useState<PostFormState>({ postTitle: "",  postKeywords: "", postCategory: "", postContent: "" });
  // next hooks //
  const router = useRouter();
  // redux hooks and state  //
  const dispatch = useDispatch();
  const { authState, blogPostsState } = useSelector((state: IGeneralState) => state);
  
  // action handlers //
  const cancelNewPost = (): void => {
    router.push("/admin/dashboard/posts");
  };
  const saveNewPost = async (): Promise<any> => {
    const { postTitle: title, postCategory: category, postContent: content } = postFormState;
    const keywords: string[] = postFormState.postKeywords ? postFormState.postKeywords.split(",") : [];
    // first validate on client side //
    const { valid, errorMessages } = blogPostValidator({ title, category, keywords, content });
    // TODO //
    // show an error div //
    if (valid) {
      try {
        await BlogPostActions.handleSaveNewBlogPost(dispatch, { title, category, keywords, content}, blogPostsState);
        router.push("/admin/dashboard/posts");
      } catch (err) {
        console.log(err)
      }
    } 
    
  };
  // form listeners to update both form and preview //
  const updateTitle = (postTitle: string): void => {
    setPostFormState({ ...postFormState, postTitle });
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
  // 
  const setPostAuthor = (authState: IAuthState): string => {
    const { firstName, lastName } = authState.currentUser;
    if (firstName && lastName) {
      return `${capitalizeString(firstName)} ${capitalizeString(lastName)}`
    } else {
      return `Anonymous`;
    }
  };

  // lifecycle hooks //
  React.useEffect(() => {
    // set local state so the form is filled out with current blog post values //
    const { title, author, content, category, keywords } = blogPostsState.currentBlogPost;
    setPostFormState({ postTitle: title,  postContent: content, postCategory: category, postKeywords: keywords.join(",") });
  }, [ blogPostsState.currentBlogPost ]);

  return (
    <AdminLayout>
      <Grid.Row className={ adminNewPostsStyle.navRow }>
        <AdminPostNav 
          savePost={ saveNewPost }
          cancelNewPost={ cancelNewPost } 
        />
      </Grid.Row>
      <Grid.Row className={ adminNewPostsStyle.previewRow }>
        <Grid.Column stretched width={ 8 } style={{ paddingRight: "5px" }}>
          <PostForm 
            updateTitle={ updateTitle }
            updateKeywords={ updateKeywords }
            updateCategory={ updateCategory }
            updateContent={ updateContent }
            postFormState={ postFormState }
            postAuthor={ setPostAuthor(authState) }
          />
        </Grid.Column>
        <Grid.Column stretched width={ 8 } style={{ paddingLeft: "5px" }}>
          <AdminPostPreview 
            postAuthor={ setPostAuthor(authState) }
            { ...postFormState }
          />
        </Grid.Column>
      </Grid.Row>
    </AdminLayout>
  );
};

export default AdminNewPost;
