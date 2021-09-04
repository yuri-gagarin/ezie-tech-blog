import React from 'react';
import Head from "next/head";
// home splash components //
import { HomeLanding } from '../components/home/HomeLanding';
import { HomeAbout } from '../components/home/HomeAbout';
import { HomeTech } from '../components/home/HomeTech';

export default function Home() {
  return ( 
    <React.Fragment>
      <Head>
        <title>A sample blog</title>
        <meta name="keywords" content="programming web development nodej typescript react javascript express"></meta>
      </Head>
      <HomeLanding />
      <HomeAbout />
      <HomeTech />
    </React.Fragment>
  );
};

/*
<Head>
<title>A sample blog</title>
<meta name="keywords" content="programming web development nodej typescript react javascript express"></meta>
</Head>
*/