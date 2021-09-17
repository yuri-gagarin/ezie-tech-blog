import * as React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';
// types //
import type { DropdownItemProps, DropdownProps } from "semantic-ui-react"
// styles //
import styles from "../../../styles/admin/AdminPostForm.module.css";
// types //
import type { PostFormState } from '../../../pages/admin/dashboard/posts/new';

interface IPostFormProps {
  updateTitle: (title: string) => void;
  updateAuthor: (author: string) => void;
  updateCategory: (category: string) => void;
  updateKeywords: (keywords: string) => void;
  updateContent: (content: string) => void;
  postFormState: PostFormState
}

const dropdownVals: DropdownItemProps[] = [
  { key: 1, text: "Informational", value: "informatonal" },
  { key: 2, text: "Beginner", value: "beginner" },
  { key: 3, text: "Intermediate", value: "intermediate" },
  { key: 4, text: "Advanced", value: "advanced" }
];

export const PostForm: React.FunctionComponent<IPostFormProps> = ({ updateTitle, updateAuthor, updateCategory, updateKeywords, updateContent, postFormState }): JSX.Element => {
  
  // action handlers //
  const handlePostTitleChange = (e:  React.FormEvent<HTMLInputElement>): void => {
    updateTitle(e.currentTarget.value);
  };
  const handleAuthorChange = (e: React.FormEvent<HTMLInputElement>): void => {
    updateAuthor(e.currentTarget.value);
  };
  const handleKeywordsChange = (e: React.FormEvent<HTMLInputElement>): void => {
    updateKeywords(e.currentTarget.value);
  };
  const handleCategoryChange = (_, data: DropdownProps): void => {
    const { value } = data;
    updateCategory(value as string);
  };
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    updateContent(e.currentTarget.value);
  };
  
  return (
    <Form>
      <Form.Field>
        <label>Title:</label>
        <input value={ postFormState.postTitle } placeholder="title here..." onChange={ handlePostTitleChange } />
      </Form.Field>
      <Form.Field>
        <label>Author</label>
        <input value={ postFormState.postAuthor } placeholder="value..." onChange={ handleAuthorChange } />
      </Form.Field>
      <Form.Field>
        <label>Keywords</label>
        <input value={ postFormState.postKeywords} placeholder="comma separated keywords" onChange={ handleKeywordsChange } />
      </Form.Field>
      <Form.Field>
        <label>Category</label>
        <Dropdown defaultValue={ postFormState.postCategory ? postFormState.postCategory : null } clearable options={dropdownVals } selection  placeholder="select category" onChange={ handleCategoryChange }/>
      </Form.Field>
      <Form.Field>
        <label>Content:</label>
        <Form.TextArea value={ postFormState.postContent } className={ styles.postTextArea } onChange={ handleTextAreaChange } />
      </Form.Field>
    </Form>
  );
};

