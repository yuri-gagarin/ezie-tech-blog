import * as React from 'react';
import { Form } from 'semantic-ui-react';
// styles //
import styles from "../../../styles/admin/AdminPostForm.module.css";

interface IPostFormProps {
  updateTitle: (title: string) => void;
  updateAuthor: (author: string) => void;
  updateCategories: (categories: string) => void;
  updateContent: (content: string) => void;
}

export const PostForm: React.FunctionComponent<IPostFormProps> = ({ updateTitle, updateAuthor, updateCategories, updateContent }): JSX.Element => {
  
  const handlePostTitleChange = (e:  React.FormEvent<HTMLInputElement>): void => {
    updateTitle(e.currentTarget.value);
  };
  const handleAuthorChange = (e: React.FormEvent<HTMLInputElement>): void => {
    updateAuthor(e.currentTarget.value);
  };
  const handleCategoriesChange = (e: React.FormEvent<HTMLInputElement>): void => {
    updateCategories(e.currentTarget.value);
  };
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    updateContent(e.currentTarget.value);
  };
  
  return (
    <Form>
      <Form.Field>
        <label>Title:</label>
        <input placeholder="title here..." onChange={ handlePostTitleChange } />
      </Form.Field>
      <Form.Field>
        <label>Author</label>
        <input placeholder="value..." onChange={ handleAuthorChange } />
      </Form.Field>
      <Form.Field>
        <label>Categories</label>
        <input placeholder="comma separated categories" onChange={ handleCategoriesChange } />
      </Form.Field>
      <Form.Field>
        <label>Content:</label>
        <Form.TextArea className={ styles.postTextArea } onChange={ handleTextAreaChange } />
      </Form.Field>
    </Form>
  );
};

