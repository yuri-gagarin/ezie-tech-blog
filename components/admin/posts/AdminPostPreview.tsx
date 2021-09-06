 /* eslint-disable */
import * as React from 'react';
import ReactMarkdown from 'react-markdown/react-markdown.min';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// styles //
import styles from "../../../styles/admin/AdminPostPreview.module.css";

interface IPostPreviewProps {
  postTitle: string;
  postAuthor: string;
  postCategories: string;
  postContent: string;
  postCategoriesArr: string[];
}

export const AdminPostPreview: React.FunctionComponent<IPostPreviewProps> = ({ postTitle, postAuthor, postCategories, postContent, postCategoriesArr }): JSX.Element => {
  return (
    <div className={ styles.adminPostPreviewWrapper }>
      <div className={ styles.adminPostPreviewHeader }>Formatted Post Preview</div>
      <div className={ styles.previewTitle }>
        <span>Title:</span>{ postTitle ? <span>{ postTitle }</span> : null }
      </div>
      <div className={ styles.previewAuthor }>
        <span>Author:</span>{ postAuthor ? <span>{ postAuthor }</span> : null }
      </div>  
      <div className={ styles.previewCategories }>
        <span>Categories:</span>
        {
          postCategoriesArr.length > 0 && postCategories[0]
          ?
          postCategoriesArr.map((cat, i) => <span key={`${cat}_${i}`} className={ styles.previewCat}>{ cat }</span>)
          :
          null
        }
      </div>
      <div className={ styles.previewContent }>
        <span>Content:</span>
        <ReactMarkdown 
          children={ postContent } 
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


