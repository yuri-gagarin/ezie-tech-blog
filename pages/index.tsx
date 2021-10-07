import React from 'react';
// next js imports //
import Head from "next/head";
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from '@/redux/store';
import { BlogPostActions } from "@/redux/actions/blogPostActions";
// home splash components //
import { HomeLanding } from '@/components/home/HomeLanding';
import { HomeAbout } from '@/components/home/HomeAbout';
import { HomeLatestBlog } from '@/components/home/HomeLatestBlog';
import { HomeTech } from '@/components/home/HomeTech';
import { HomeProjects } from "@/components/home/HomeProjects";
// types //
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Dispatch } from "redux";
import type { IGeneralState } from '@/redux/_types/generalTypes';
import type { BlogPostData } from "@/redux/_types/blog_posts/dataTypes";
import type { BlogPostAction } from '@/redux/_types/blog_posts/actionTypes';

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {

  const dispatch: Dispatch<BlogPostAction> = store.dispatch;
  try {
    await BlogPostActions.handleFetchBlogPosts(dispatch, { limit: 3, createdAt: "asc" });
  } catch (error) {
    BlogPostActions.handleBlogPostError(dispatch, error);
  }
  return {
    props: {} 
  }
})

export default function Home(): JSX.Element {
  // next hooks //
  const router = useRouter();
  // redux hooks //
  const dispatch = useDispatch<Dispatch<BlogPostAction>>();
  const { blogPostsState } = useSelector((state: IGeneralState) => state);
  // action handlers //
  const navigateToBlogPost = (blogPostId: string) => {
    const currentPost: BlogPostData = BlogPostActions.handleSetCurrentBlogPost(dispatch, blogPostId, blogPostsState);
    router.push(`/blog/${currentPost.slug}`);
  }
  return ( 
    <React.Fragment>
      <Head>
        <title>Eezie Tech Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />        <meta name="description" content="Eezie tech. We make tech easy for people of all backgrounds." />
        <meta name="keywords" content="programming web development nodej typescript react javascript express"></meta>
      </Head>
      <HomeLanding />
      <HomeAbout />
      <HomeTech />
      <HomeLatestBlog 
        blogPostsArr={ blogPostsState.blogPosts }
        navigateToBlogPost={ navigateToBlogPost }
      />
      <HomeProjects />
    </React.Fragment>
  );
};