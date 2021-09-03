import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>A sample blog</title>
        <meta name="keywords" content="programming web development nodej typescript react javascript express"></meta>
      </Head>
      <div>Initial Setup</div>
    </div>
  )
}
