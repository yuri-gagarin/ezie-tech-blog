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
}

export const BlogViewModal: React.FunctionComponent<IBlogViewModalProps> = ({ modalOpen, blogPostData, closeModal }): JSX.Element => {
  return (
    <Modal size="fullscreen" open={ modalOpen } className={ styles.modalWrapper }>
      <Modal.Content>
        <Button.Group>
          <Button content="Close" color="orange" onClick={ closeModal }/>
          <Button content="Edit" color="purple" />
        </Button.Group>
        <Button.Group>
          <Button content="Publish" color="green" />
        </Button.Group>
      </Modal.Content>
      <Modal.Header>{ blogPostData.title }</Modal.Header>
      <Modal.Content scrolling>
        <div className={ styles.authorDiv }>Author: <span>{ blogPostData.author}</span></div>
        <div className={ styles.categoryDiv }>Category: <span>{ blogPostData.category}</span></div>
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