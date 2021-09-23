import * as React from 'react';
import { Icon, Label, Popup } from 'semantic-ui-react';
// types //
import type { BlogPostData } from '../../redux/_types/blog_posts/dataTypes';
import type { AdminData, UserData } from "../../redux/_types/users/dataTypes";
// styles //
import styles from "../../styles/blog/BlogPostLikes.module.css";

interface IBlogPostLikesProps {
  attached?: "top" | "bottom" | "top right" | "top left" | "bottom left" | "bottom right";
  blogPostData: BlogPostData;
  currentUserData: UserData | AdminData | null;
  handleBlogPostLike(blogPostId: string): Promise<any>;
}

export const BlogPostLikes: React.FunctionComponent<IBlogPostLikesProps> = ({ attached, blogPostData, currentUserData, handleBlogPostLike }): JSX.Element => {
  // local comp state and  data //
  const { _id: blogPostId, numOflikes } = blogPostData;
  const [ likedPost, setLikedPost ] = React.useState<boolean>(false);

  // lifecycle hooks //
  React.useEffect(() => {
    if (currentUserData) {
      if (blogPostData.likes.includes(currentUserData._id)) setLikedPost(true);
      else setLikedPost(false);
    } else {
      setLikedPost(false);
    }
  }, [ currentUserData, blogPostData.likes ]);

  return (
    <Label color="blue" attached={ attached } className={ styles.blogPostLabel }>
      <span>Likes: </span>
      <span onClick={() => handleBlogPostLike(blogPostId) }>
        <Popup 
          size="mini"
          position={"top center"}
          content={ likedPost ? "Unlike Blog Post" : "Like Blog Post" }
          trigger={<Icon color="red" name="heart" className={ `${styles.blogLikeIcon} ${ likedPost ? styles.likedIcon : styles.notLikedIcon }` } />}
        />
      </span>
      <span>{ numOflikes }</span>
    </Label>
  );
};
