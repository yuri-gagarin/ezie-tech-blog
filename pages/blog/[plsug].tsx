import * as React from 'react';
import { Button, Icon, Label } from "semantic-ui-react"; 
// markdown display - needed to properly format //
import ReactMarkdown from 'react-markdown/react-markdown.min';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// next imports //
import Head from "next/head";
import { useRouter } from "next/router";
// redux  imports //
import { useSelector } from "react-redux";
// styles //
import styles from "../../styles/blog/BlogPostPageView.module.css";
// types //
import type { IGeneralState } from "../../redux/_types/generalTypes";
import type  { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
//import type { BlogPostData } from '../../redux/_types/blog_posts/dataTypes';
// helpers //
import { formatTimeString } from "../../components/_helpers/displayHelpers";

interface IPostPageProps {
}

const BlogPostPage: React.FunctionComponent<IPostPageProps> = ({ }): JSX.Element => {
  const { currentBlogPost } = useSelector((state: IGeneralState) => state.blogPostsState);
  const router = useRouter();

  const pickLabelColor = (index: number): SemanticCOLORS => {
    const colors: SemanticCOLORS[] = [ "purple", "pink" ];
    return index % 2 === 0 ? colors[0] : colors[1];
  }
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
            <Label color="teal" content="Author: " icon="user" /><span>{ currentBlogPost.author }</span>
          </div>
          <div className={ styles.blogPostTimeStampsDiv }>
            <Label color="grey" content="Posted at:" icon="calendar" /><span>{ formatTimeString(currentBlogPost.createdAt, { yearOnly: true }) }</span>
          </div>
        </div>
        <div className={ styles.blogPostKeywordsDiv }>
          {
            currentBlogPost.keywords.map((keyword, i) => <Label tag color={pickLabelColor(i)} key={ keyword } content={ keyword } /> )
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
