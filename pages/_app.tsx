import React from "react";
import App, { AppInitialProps, AppContext } from "next/app";
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import Layout from '../components/layout/Layout';
import { wrapper } from "../redux/store";



class WrappedApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps(store => async ({Component, ctx}) => {
    return {
      pageProps: {
        ...(Component.getInitialProps ? await Component.getInitialProps({...ctx, store}) : {}),
        pathname: ctx.pathname,
      },
    };
  });
  
  public render () {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <Component { ...pageProps } />
      </Layout>
    );
  }
}

export default wrapper.withRedux(WrappedApp);
