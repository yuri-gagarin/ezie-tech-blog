import React from 'react';
import { Grid, Ref } from "semantic-ui-react";
// next js imports //
import Head from "next/head";
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from '@/redux/store';
import { BlogPostActions } from "@/redux/actions/blogPostActions";
import { RssActions } from "@/redux/actions/rssActions";
// home splash components //
import { HomeLanding } from '@/components/home/HomeLanding';
import { HomeLatestBlog } from '@/components/home/HomeLatestBlog';
import { HomeNews } from '@/components/home/HomeNews';
import { HomeTech } from '@/components/home/HomeTech';
import { HomeProjects } from "@/components/home/HomeProjects";
// styles //
import styles from "@/styles/MainLandingPage.module.css";
// types //
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Dispatch } from "redux";
import type { IGeneralState } from '@/redux/_types/generalTypes';
import type { BlogPostData } from "@/redux/_types/blog_posts/dataTypes";
import type { BlogPostAction } from '@/redux/_types/blog_posts/actionTypes';
import type { RSSSources } from "@/redux/_types/rss/dataTypes";
import { RSSAction } from '@/redux/_types/rss/actionTypes';

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
});

export default function Home(): JSX.Element {
  // local state and refs //
  // next hooks //
  const router = useRouter();
  // redux hooks //
  const dispatch = useDispatch<Dispatch<BlogPostAction | RSSAction>>();
  const { blogPostsState } = useSelector((state: IGeneralState) => state);
  // action handlers //
  const navigateToBlogPost = (blogPostId: string) => {
    const currentPost: BlogPostData = BlogPostActions.handleSetCurrentBlogPost(dispatch, blogPostId, blogPostsState);
    router.push(`/blog/${currentPost.slug}`);
  };
  const handleGoToSpecificFeed = async (e: React.MouseEvent<HTMLDivElement>): Promise<any> => {
    const feedSource = (e.currentTarget.dataset['value']) as RSSSources;
    try {
      switch (feedSource) {
        case "reddit": {
          await RssActions.getRSSFeed({ dispatch, optsData: { option: "reddit", getOpts: { limit: 10,} } });
          break;
        }
        case "medium": {
          await RssActions.getRSSFeed({ dispatch, optsData: { option: "medium" } });
          break;
        }
        case "cnet": {
          await RssActions.getRSSFeed({ dispatch, optsData: { option: "cnet" } });
          break;
        }
        default: return; // have a notifier for a wrong input later //
      }
      return router.push("/news");
    } catch (error) {
      return RssActions.handleRssFeedError(error, dispatch);
    }
  };
  
  const handleSeeMore = (): void => {
    const elem = document.getElementById("homeTechRow");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };
  

  const handleGoToSection = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const target = e.currentTarget.dataset["value"]
    if (target) {
      router.push(`/${target}`);
    }
  }
  

  return ( 
    <Grid className={ styles.mainLandingGrid }>
      <Head>
        <title>Eezie Tech Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />        <meta name="description" content="Eezie tech. We make tech easy for people of all backgrounds." />
        <meta name="keywords" content="programming web development nodej typescript react javascript express"></meta>
      </Head>
      <HomeLanding handleSeeMore={ handleSeeMore } />
      <HomeTech />
      <HomeNews handleGoToSpecificFeed={ handleGoToSpecificFeed } />
      <HomeLatestBlog 
        blogPostsArr={ blogPostsState.blogPosts }
        navigateToBlogPost={ navigateToBlogPost }
        handleGoToSection={ handleGoToSection }
      />
      <HomeProjects 
        handleGoToSection={ handleGoToSection }
      />
    </Grid>
  );
};