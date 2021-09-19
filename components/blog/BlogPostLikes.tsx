import * as React from 'react';
import { Icon, Label, Popup } from 'semantic-ui-react';
// styles //
import styles from "../../styles/blog/BlogPostLikes.module.css";

interface IBlogPostLikesProps {
  attached?: "top" | "bottom" | "top right" | "top left" | "bottom left" | "bottom right";
  handleBlogPostLike(blogPostId: string): Promise<any>;
}

export const BlogPostLikes: React.FunctionComponent<IBlogPostLikesProps> = ({ attached, handleBlogPostLike }): JSX.Element => {
  return (
    <Label color="blue" attached={ attached } className={ styles.blogPostLabel }>
      <span>Likes: </span>
      <span onClick={() => handleBlogPostLike("idwillbehere") }>
        <Popup 
          size="mini"
          position={"top center"}
          content="Like Blog Post"
          trigger={<Icon color="red" name="heart" className={ styles.blogLikeIcon } />}
        />
      </span>
      <span>1</span>
    </Label>
  );
};
