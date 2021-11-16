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
  updateCategory: (category: string) => void;
  updateKeywords: (keywords: string) => void;
  updateContent: (content: string) => void;
  postFormState: PostFormState;
  postAuthor: string;
}

const dropdownVals: DropdownItemProps[] = [
  { key: 1, text: "Informational", value: "informatonal" },
  { key: 2, text: "Beginner", value: "beginner" },
  { key: 3, text: "Intermediate", value: "intermediate" },
  { key: 4, text: "Advanced", value: "advanced" }
];

export const PostForm: React.FunctionComponent<IPostFormProps> = ({ updateTitle, updateCategory, updateKeywords, updateContent, postFormState, postAuthor }): JSX.Element => {
  
  // action handlers //
  const handlePostTitleChange = (e:  React.FormEvent<HTMLInputElement>): void => {
    updateTitle(e.currentTarget.value);
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
    <Form className={ styles.adminPostForm } data-test-id="Admin_New_Post_Form">
      <Form.Field>
        <label>Title:</label>
        <input value={ postFormState.postTitle } placeholder="title here..." onChange={ handlePostTitleChange }  data-test-id="Admin_New_Post_Title_Input" />
      </Form.Field>
      <Form.Field>
        <label>Author</label>
        <div>{postAuthor}</div>
      </Form.Field>
      <Form.Field>
        <label>Keywords</label>
        <input value={ postFormState.postKeywords} placeholder="comma separated keywords" onChange={ handleKeywordsChange } data-test-id="Admin_New_Post_Keywords_Input"  />
      </Form.Field>
      <Form.Field>
        <label>Category</label>
        <Dropdown defaultValue={ postFormState.postCategory ? postFormState.postCategory : null } clearable options={dropdownVals } selection  placeholder="select category" onChange={ handleCategoryChange } data-test-id="Admin_New_Post_Category_Input" />
      </Form.Field>
      <Form.Field>
        <label>Content:</label>
        <Form.TextArea value={ postFormState.postContent } className={ styles.postTextArea } onChange={ handleTextAreaChange } data-test-id="Admin_New_Post_Content_Input" />
      </Form.Field>
    </Form>
  );
};

