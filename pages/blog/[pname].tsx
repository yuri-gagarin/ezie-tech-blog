import * as React from 'react';
import ReactMarkdown from 'react-markdown/react-markdown.min';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// styles //
import styles from "../../styles/blog/BlogPostPage.module.css";
// types //
import type  { BlogPostData } from '../../redux/_types/blog_posts/dataTypes';
interface IPostPageProps {
  blogPost: BlogPostData
}

const BlogPostPage: React.FunctionComponent<IPostPageProps> = ({ blogPost }): JSX.Element => {
  return (
    <div className={ styles.blogPostPageWrapper }>
      <div className={ styles.blogPostPageTitle }>
        <div className={ styles.blogPostTitleContent }>Blog Post Title here</div>
      </div>
      <div className={ styles.blogPostPageMeta }>
        <div className={ styles.blogPostAuthorDiv }>Author Here</div>
        <div className={ styles.blogPostTimeStampsDiv }>Timestamps here</div>
        <div className={ styles.blogPostCategoriesDiv }>categories here</div>
      </div>
      <div className={ styles.blogPostPageMainContent} >
      <ReactMarkdown 
          children={ blogPost.content } 
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
