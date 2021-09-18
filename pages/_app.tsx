import React from "react";
import NProgress from "nprogress";
// next imports //
import App, { AppInitialProps, AppContext } from "next/app";
import Router from "next/router";
// redux imports //
import { wrapper } from "../redux/store";
// additional components //
import Layout from '../components/layout/Layout';
// styles //
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import "nprogress/nprogress.css";

class WrappedApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps(store => async ({Component, ctx}) => {
    return {
      pageProps: {
        ...(Component.getInitialProps ? await Component.getInitialProps({...ctx, store}) : {}),
        pathname: ctx.pathname
      },
    };
  });

  componentDidMount() {
    NProgress.configure({ showSpinner: true, easing: "ease", speed: 500 });
    Router.events.on("routeChangeStart", () => {
      console.log("routing");
      NProgress.start();
    });
    Router.events.on("routeChangeComplete", () => {
      NProgress.done();
    })
  }
  
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
