 /* eslint-disable */
import * as React from 'react';
import ReactMarkdown from 'react-markdown/react-markdown.min';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// styles //
import styles from "../../../styles/admin/AdminPostPreview.module.css";
// helpers //
import { capitalizeString } from "../../_helpers/displayHelpers";

interface IPostPreviewProps {
  postTitle: string;
  postKeywords: string;
  postCategory: string;
  postContent: string;
  postAuthor: string;
}

export const AdminPostPreview: React.FunctionComponent<IPostPreviewProps> = ({ postTitle, postAuthor, postKeywords, postCategory, postContent }): JSX.Element => {
  const [ postKeywordsArr, setPostKeywordsArr ] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (postKeywords) setPostKeywordsArr(postKeywords.split(","));
  }, [ postKeywords ]);

  return (
    <div className={ styles.adminPostPreviewWrapper } data-test-id="post-preview">
      <div className={ styles.adminPostPreviewHeader }>Formatted Post Preview</div>
      <div className={ styles.previewTitle } data-test-id="post-title-preview">
        <span>Title:</span>{ postTitle ? <span >{ postTitle }</span> : null }
      </div>
      <div className={ styles.previewAuthor } data-test-id="post-author-preview">
        <span>Author:</span>{ postAuthor ? <span >{ postAuthor }</span> : null }
      </div>  
      <div className={ styles.previewCategory } data-test-id="post-category-preview">
        <span>Category:</span>{ postCategory ? <span>{capitalizeString(postCategory)}</span> : null }
      </div>  
      <div className={ styles.previewKeywords } data-test-id="post-keywords-preview">
        <span>Keywords:</span>
        {
          postKeywordsArr.length > 0 && postKeywordsArr[0]
          ?
          postKeywordsArr.map((cat, i) => <span key={`${cat}_${i}`} className={ styles.previewKeywordSpan } data-test-id="post-keyword-preview-span">{ cat }</span>)
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


