import * as React from 'react';
import { Icon, Label, Popup } from 'semantic-ui-react';
import { BlogPostData } from '../../redux/_types/blog_posts/dataTypes';
// styles //
import styles from "../../styles/blog/BlogPostLikes.module.css";

interface IBlogPostLikesProps {
  attached?: "top" | "bottom" | "top right" | "top left" | "bottom left" | "bottom right";
  blogPostData: BlogPostData;
  handleBlogPostLike(blogPostId: string): Promise<any>;
}

export const BlogPostLikes: React.FunctionComponent<IBlogPostLikesProps> = ({ attached, blogPostData, handleBlogPostLike }): JSX.Element => {
  return (
    <Label color="blue" attached={ attached } className={ styles.blogPostLabel }>
      <span>Likes: </span>
      <span onClick={() => handleBlogPostLike(blogPostData._id) }>
        <Popup 
          size="mini"
          position={"top center"}
          content="Like Blog Post"
          trigger={<Icon color="red" name="heart" className={ styles.blogLikeIcon } />}
        />
      </span>
      <span>{ blogPostData.numOflikes }</span>
    </Label>
  );
};
