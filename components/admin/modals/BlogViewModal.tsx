import * as React from 'react';
import { Button, Modal } from "semantic-ui-react";
// type //
import type { BlogPostData } from '../../../redux/_types/blog_posts/dataTypes';
// styles //
import styles from "../../../styles/admin/AdminBlogViewModal.module.css";

interface IBlogViewModalProps {
  modalOpen: boolean;
  blogPostData: BlogPostData;
  closeModal(): void;
  goToBlogPostEdit(): void;
  triggerBlogPostDelete(): void;
}

export const BlogViewModal: React.FunctionComponent<IBlogViewModalProps> = ({ modalOpen, blogPostData, closeModal, goToBlogPostEdit, triggerBlogPostDelete }): JSX.Element => {
  return (
    <Modal size="fullscreen" open={ modalOpen } className={ styles.modalWrapper } data-test-id="Admin_Blog_View_Modal">
      <Modal.Content>
        <Button.Group>
          <Button content="Close" color="orange" onClick={ closeModal } data-test-id="Blog_Modal_Close_Btn" />
          <Button content="Edit" color="purple" onClick={ goToBlogPostEdit } data-test-id="Blog_Modal_Edit_Btn" />
        </Button.Group>
        <Button.Group>
          <Button content="Publish" color="green" data-test-id="Blog_Modal_Publish_Btn" />
        </Button.Group>
        <Button.Group>
          <Button content="Delete" color="red" onClick={ triggerBlogPostDelete } data-test-id="Blog_Modal_Delete_Btn" />
        </Button.Group>
      </Modal.Content>
      <Modal.Header data-test-id="Blog_Modal_Title">{ blogPostData.title }</Modal.Header>
      <Modal.Content scrolling>
        <div className={ styles.authorDiv } data-test-id="Blog_Modal_Author">Author: <span>{blogPostData.author.name}</span></div>
        <div className={ styles.categoryDiv } data-test-id="Blog_Modal_Category">Category: <span>{ blogPostData.category }</span></div>
        <div className={ styles.keywordsDiv }>Keywords: 
          {
            blogPostData.keywords.map(word => <span key={ word } data-test-id="Blog_Modal_Keyword_Span">{ word }</span>)
          }
        </div>

        <div dangerouslySetInnerHTML={{ __html: blogPostData.content }} />
      </Modal.Content>
    </Modal>
  );
};