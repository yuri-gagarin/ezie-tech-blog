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
    <Modal size="fullscreen" open={ modalOpen } className={ styles.modalWrapper } data-test-id="blog-view-modal">
      <Modal.Content>
        <Button.Group>
          <Button content="Close" color="orange" onClick={ closeModal } data-test-id="blog-modal-close-btn" />
          <Button content="Edit" color="purple" onClick={ goToBlogPostEdit } data-test-id="blog-modal-edit-btn" />
        </Button.Group>
        <Button.Group>
          <Button content="Publish" color="green" data-test-id="blog-modal-publish-btn" />
        </Button.Group>
        <Button.Group>
          <Button content="Delete" color="red" onClick={ triggerBlogPostDelete } data-test-id="blog-modal-delete-btn" />
        </Button.Group>
      </Modal.Content>
      <Modal.Header data-test-id="blog-modal-title">{ blogPostData.title }</Modal.Header>
      <Modal.Content scrolling>
        <div className={ styles.authorDiv } data-test-id="blog-modal-author">Author: <span>{blogPostData.author.name}</span></div>
        <div className={ styles.categoryDiv } data-test-id="blog-modal-category">Category: <span>{ blogPostData.category }</span></div>
        <div className={ styles.keywordsDiv }>Keywords: 
          {
            blogPostData.keywords.map(word => <span key={ word } data-test-id="blog-modal-keyword-span">{ word }</span>)
          }
        </div>

        <div dangerouslySetInnerHTML={{ __html: blogPostData.content }} />
      </Modal.Content>
    </Modal>
  );
};