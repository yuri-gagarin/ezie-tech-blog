import React from 'react';
import Head from 'next/head';
import { HomeLanding } from '../components/home/HomeLanding';
import homeStyles from "../styles/home/Home.module.css";

export default function Home() {
  return ( 
    <HomeLanding />
  )
};

/*
<Head>
<title>A sample blog</title>
<meta name="keywords" content="programming web development nodej typescript react javascript express"></meta>
</Head>
*/