import React from "react";
import App, { AppInitialProps, AppContext } from "next/app";
import { useDispatch, Provider } from "react-redux";
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import Layout from '../components/layout/Layout';
import { wrapper } from "../redux/store";



class WrappedApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps(store => async ({Component, ctx}) => {
    console.log(13);
    console.log(store);
    return {
      pageProps: {
        // Call page-level getInitialProps
        // DON'T FORGET TO PROVIDE STORE TO PAGE
        ...(Component.getInitialProps ? await Component.getInitialProps({...ctx, store}) : {}),
        // Some custom thing for all pages
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
