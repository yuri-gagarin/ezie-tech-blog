import * as React from 'react';
import { Grid } from "semantic-ui-react";
// next //
import { useRouter } from "next/router";
// redux and actions //
import { useDispatch, useSelector } from 'react-redux';
import { BlogPostActions } from "@/redux/actions/blogPostActions";
// additional components //
import { PostForm } from "@/components/admin/forms/PostForm";
import { AdminPostNav } from '@/components/admin/posts/AdminPostNav';
import { AdminPostPreview } from '@/components/admin/posts/AdminPostPreview';
import { GenErrorModal } from "@/components/modals/GenErrorModal";
// errors handling //
// types //
import type { IGeneralState } from '@/redux/_types/generalTypes';
// styles //
import styles from "@/styles/user/UserPostEditor.module.css";
// helpers //
import { blogPostValidator } from '@/components/_helpers/validators';
import { capitalizeString, setPostAuthor, checkEmptyObjVals } from '@/components/_helpers/displayHelpers';
import { IAuthState } from '@/redux/_types/auth/dataTypes';
import { BlogPostFormData } from '@/redux/_types/blog_posts/dataTypes';
import { ClientInputError } from '@/components/_helpers/errorHelpers';
import { objectIsEmtpy } from '@/server/src/controllers/_helpers/generalHelpers';

interface IUserPostEditorProps {

}
export type PostFormState = {
  postTitle: string;
  postKeywords: string;
  postCategory: string;
  postContent: string;
}

const UserPostEditor: React.FunctionComponent<IUserPostEditorProps> = (props): JSX.Element => {
  // local component hooks and state //
  const [ postFormState, setPostFormState ] = React.useState<PostFormState>({ postTitle: "",  postKeywords: "", postCategory: "", postContent: "" });
  // next hooks //
  const router = useRouter();
  // redux hooks and state  //
  const dispatch = useDispatch();
  const { authState, blogPostsState } = useSelector((state: IGeneralState) => state);
  const { error, errorMessages, currentBlogPost } = blogPostsState;
  //
  // action handlers //
  const cancelNewPost = (): void => {
    router.push("/user/dashboard/posts");
  };
  const handleSavePost = async (): Promise<any> => {
    const { postTitle: title, postCategory: category, postContent: content } = postFormState;
    const { authToken: JWTToken, currentUser } = authState;
    const keywords: string[] = postFormState.postKeywords ? postFormState.postKeywords.split(",") : [];
    //
    const author: { name: string; authorId: string } = { name: setPostAuthor(authState), authorId: currentUser._id };
    
    // first validate on client side //
    const { valid, errorMessages } = blogPostValidator({ title, category, keywords, content, author });
    // TODO //
    // show an error div //
    if (valid) {
      try {
        const blogPostFormData: BlogPostFormData = { title, author, category, content, keywords };
        if (objectIsEmtpy(currentBlogPost)) {
          await BlogPostActions.handleSaveNewBlogPost({ dispatch, JWTToken, blogPostFormData, state: blogPostsState });
          router.push("/user/dashboard/posts");
        } else {
          const { _id: postId } = currentBlogPost;
          await BlogPostActions.handleEditBlogPost({ dispatch, JWTToken, blogPostFormData, postId, state: blogPostsState });
        }   
      } catch (err) {
        return BlogPostActions.handleBlogPostError(dispatch, err);
      }
    } else {
      const error: ClientInputError = new ClientInputError("Invalid Data", errorMessages);
      BlogPostActions.handleBlogPostError(dispatch, error);
    }
  };
  const handleErrorDismiss = () => {
    return BlogPostActions.handleClearBlogPostError(dispatch);
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
  // lifecycle hooks //
  React.useEffect(() => {
    // set local state so the form is filled out with current blog post values //
    const { title, author, content, category, keywords } = blogPostsState.currentBlogPost;
    setPostFormState({ postTitle: title,  postContent: content, postCategory: category, postKeywords: keywords.join(",") });
  }, [ blogPostsState.currentBlogPost ]);

  return (
    <React.Fragment>
      <GenErrorModal 
        open={ error ? true : false }
        handleErrorModalClose={ handleErrorDismiss }
        errorMessages={errorMessages ? errorMessages : [ "An error occured" ] }
        position="fixed-top"
      />
      <Grid.Row className={ styles.navRow }>
        <AdminPostNav 
          savePost={ handleSavePost }
          cancelNewPost={ cancelNewPost } 
        />
      </Grid.Row>
      <Grid.Row className={ styles.previewRow } data-test-id="new-post-main-row">
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
    </React.Fragment>
  );
};

export default UserPostEditor;
