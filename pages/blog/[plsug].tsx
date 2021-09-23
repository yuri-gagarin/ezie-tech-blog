import * as React from 'react';
import { Button, Icon, Label } from "semantic-ui-react"; 
// markdown display - needed to properly format //
import ReactMarkdown from 'react-markdown/react-markdown.min';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axiosInstance from "../../components/axios/axiosInstance";
// next imports //
import Head from "next/head";
import { useRouter } from "next/router";
// redux  imports //
import { useDispatch, useSelector } from "react-redux";
import { BlogPostActions } from "../../redux/actions/blogPostActions";
import { wrapper } from "../../redux/store";
// additional component imports //
import { BlogPostLikes } from "../../components/blog/BlogPostLikes"; 
// styles //
import styles from "../../styles/blog/BlogPostPageView.module.css";
// types //
import type { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import type { Dispatch } from "redux";
import type { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import type { GetServerSideProps,  GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { BlogPostAction } from "../../redux/_types/blog_posts/actionTypes";
import type { OneBlogPostRes } from '../../redux/_types/blog_posts/dataTypes';
import type { IGeneralState } from "../../redux/_types/generalTypes";
//import type { BlogPostData } from '../../redux/_types/blog_posts/dataTypes';
// helpers //
import { formatTimeString } from "../../components/_helpers/displayHelpers";

interface IPostPageProps {

}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const slugArr = context.req.url.split("/")
  const blogPostSlug: string = slugArr[slugArr.length - 1];
  const opts: AxiosRequestConfig = {
    method: "GET",
    url: "/api/posts/" + blogPostSlug,
    params: {
      searchBySlug: true
    }
  }
  try {
    const { status, data }: AxiosResponse<OneBlogPostRes> = await axiosInstance(opts);
    const { responseMsg, blogPost } = data;
    store.dispatch({ type: "SetBlogPost", payload: { status, responseMsg, blogPost, loading: false } });
    return {
      props: { }
    }
  } catch (err) {
    // TODO //
    // error handling helpers //
    if (err.response && err.response.status === 404) {
      return {
        redirect: {
          destination: "404",
          permanent: true
        }
      }
    } else {
      return {
        redirect: {
          destination: "error",
          permanent: true
        }
      }
    }
  }
});

const BlogPostPage: React.FunctionComponent<IPostPageProps> = ({ }): JSX.Element => {
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<BlogPostAction>>();
  const { blogPostsState, authState } = useSelector((state: IGeneralState) => state)
  const { title, author, category, keywords, content, createdAt, editedAt } = blogPostsState.currentBlogPost;

  // actions //
  const pickLabelColor = (index: number): SemanticCOLORS => {
    const colors: SemanticCOLORS[] = [ "purple", "pink" ];
    return index % 2 === 0 ? colors[0] : colors[1];
  };
  const handleBlogPostLike = async (blogPostId: string): Promise<any> => {
    const { authToken, loggedIn } = authState;
    if (loggedIn && authToken) {
      try {
        return await BlogPostActions.handleToggleBlogPostLike(dispatch, blogPostId, authToken, blogPostsState);
      } catch (error) {
        return BlogPostActions.handleBlogPostError(dispatch, error);
      }
    }
  };
  // END actions //
  return (
    <>
    <Head>
      <title>{ title }</title>
    </Head>
    <div className={ styles.blogPostPageWrapper }>
      <div className={ styles.blogPostPageTitle }>
        <div className={ styles.blogPostTitleContent }>{ title }</div>
      </div>
      <div className={ styles.blogPostPageMeta }>
        <div className={ styles.blogPostAuthorAndTimeStamps }>
          <div className={ styles.blogPostAuthorDiv }>
            <Label color="teal" content="Author: " icon="user" /><span>{ author }</span>
          </div>
          <div className={ styles.blogPostTimeStampsDiv }>
            <Label color="grey" content="Posted at:" icon="calendar" /><span>{ formatTimeString(createdAt, { yearOnly: true }) }</span>
          </div>
        </div>
        <div className={ styles.blogPostKeywordsDiv }>
          {
            keywords.map((keyword, i) => <Label tag color={pickLabelColor(i)} key={ keyword } content={ keyword } /> )
          }
        </div>
      </div>
      <div className={ styles.blogPostPageMainContent} >
        <ReactMarkdown 
            children={ content } 
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
      <div className={ styles.blogPostLikesDiv }>
        <BlogPostLikes 
          blogPostData={ blogPostsState.currentBlogPost }
          currentUserData={ authState.currentUser }
          handleBlogPostLike={ handleBlogPostLike }
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
