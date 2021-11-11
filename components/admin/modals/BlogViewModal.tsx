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
    <Modal size="fullscreen" open={ modalOpen } className={ styles.modalWrapper }>
      <Modal.Content>
        <Button.Group>
          <Button content="Close" color="orange" onClick={ closeModal } />
          <Button content="Edit" color="purple" onClick={ goToBlogPostEdit } />
        </Button.Group>
        <Button.Group>
          <Button content="Publish" color="green" />
        </Button.Group>
        <Button.Group>
          <Button content="Delete" color="red" onClick={ triggerBlogPostDelete } />
        </Button.Group>
      </Modal.Content>
      <Modal.Header>{ blogPostData.title }</Modal.Header>
      <Modal.Content scrolling>
        <div className={ styles.authorDiv }>Author: <span>{ blogPostData.author.name }</span></div>
        <div className={ styles.categoryDiv }>Category: <span>{ blogPostData.category }</span></div>
        <div className={ styles.keywordsDiv }>Keywords: 
          {
            blogPostData.keywords.map(word => <span key={ word }>{ word }</span>)
          }
        </div>

        <div dangerouslySetInnerHTML={{ __html: blogPostData.content }} />
      </Modal.Content>
    </Modal>
  );
};