import * as React from 'react';
import { Button } from "semantic-ui-react"; 
import Head from "next/head";
import { useRouter } from "next/router";
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
  const router = useRouter();

  return (
    <>
    <Head>
      <title>{ currentBlogPost.title }</title>
    </Head>
    <div className={ styles.blogPostPageWrapper }>
      <div className={ styles.blogPostPageTitle }>
        <div className={ styles.blogPostTitleContent }>{ currentBlogPost.title }</div>
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
        <div className={ styles.blogPostKeywordsDiv }>
          {
            currentBlogPost.keywords.map((keyword) => <span key={ keyword } className={  styles.blogPostKeywordsSpan } >{ keyword }</span>)
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
      <div className={ styles.blogPostControlsDiv }>
        <Button.Group>
          <Button basic content="Back" color="violet" onClick={ () => router.back() } />
          <Button basic content="Contact Author" color="green" />
          <Button basic content="Contact Us" color="purple" />

        </Button.Group>
      </div>
    </div>
    </>
  );
};

export default BlogPostPage;
