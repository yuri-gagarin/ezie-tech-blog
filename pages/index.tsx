import React from 'react';
// next js imports //
import Head from "next/head";
// home splash components //
import { HomeLanding } from '@/components/home/HomeLanding';
import { HomeAbout } from '@/components/home/HomeAbout';
import { HomeTech } from '@/components/home/HomeTech';
import { HomeProjects } from "@/components/home/HomeProjects";
// types //
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const { req } = context;
  const { cookies } = req;
  return {
    props: {} 
  }
}

export default function Home() {

  return ( 
    <React.Fragment>
      <Head>
        <title>Eezie Tech Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Eezie tech. We make tech easy for people of all backgrounds." />
        <meta name="keywords" content="programming web development nodej typescript react javascript express"></meta>
      </Head>
      <HomeLanding />
      <HomeAbout />
      <HomeTech />
      <HomeProjects />
    </React.Fragment>
  );
};