import * as React from 'react';
// redux //
import { useSelector } from "react-redux";
import ReactMarkdown from 'react-markdown/react-markdown.min';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// styles //
import styles from "../../styles/blog/BlogPostPageView.module.css";
// types //
import type { IGeneralState } from "../../redux/_types/generalTypes";
//import type { BlogPostData } from '../../redux/_types/blog_posts/dataTypes';
// helpers //
import { formatTimeString } from "../../components/_helpers/displayHelpers";

interface IPostPageProps {
}

const BlogPostPage: React.FunctionComponent<IPostPageProps> = ({ }): JSX.Element => {
  const { currentBlogPost } = useSelector((state: IGeneralState) => state.blogPostsState);
  return (
    <div className={ styles.blogPostPageWrapper }>
      <div className={ styles.blogPostPageTitle }>
        <div className={ styles.blogPostTitleContent }>Blog Post Title here</div>
      </div>
      <div className={ styles.blogPostPageMeta }>
        <div className={ styles.blogPostAuthorAndTimeStamps }>
          <div className={ styles.blogPostAuthorDiv }>
            <span>Author:</span><span>{ currentBlogPost.author }</span>
          </div>
          <div className={ styles.blogPostTimeStampsDiv }>
            <span>Posted:</span><span>{ formatTimeString(currentBlogPost.createdAt as string, { yearOnly: true }) }</span>
          </div>
        </div>
        <div className={ styles.blogPostCategoriesDiv }>
          {
            currentBlogPost.keywords.map((keyword) => <span key={ keyword } className={  styles.blogPostCategoriesSpan } >{ keyword }</span>)
          }
        </div>
      </div>
      <div className={ styles.blogPostPageMainContent} >
        <ReactMarkdown 
            children={ currentBlogPost.content } 
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={dark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          />
      </div>
    </div>
  );
};

export default BlogPostPage;
