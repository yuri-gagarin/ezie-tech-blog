import React from "react";
import NProgress from "nprogress";
// next imports //
import App, { AppInitialProps, AppContext } from "next/app";
import Router from "next/router";
// redux imports //
import { wrapper, store } from "../redux/store";
// firebase for storage //
import FirebaseController from "../firebase/firebaseSetup";
// additional components //
import Layout from '../components/layout/Layout';
// types //
import type { Store } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
// styles //
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import "nprogress/nprogress.css";
import 'react-image-lightbox/style.css'

declare global {
  interface Window { Cypress: any; store: Store<IGeneralState>  }
}

interface IAppInitialState {
  firebaseContInstance: null | FirebaseController;
}

class WrappedApp extends App<AppInitialProps, any, IAppInitialState> {
  constructor(props: any) {
    super(props)
    this.state = {
      firebaseContInstance: new FirebaseController()
    }
  }
  
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
      NProgress.start();
    });
    Router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });
    Router.events.on("routeChangeError", () => {
      NProgress.done();
    });
    if (window && window.Cypress) {
      window.store = store; 
    }
  }
  
  public render () {
    const { Component, pageProps } = this.props;
    const { firebaseContInstance } = this.state;
    return (
      <Layout { ...pageProps }>
        <Component 
          firebaseContInstance={firebaseContInstance} 
          { ...pageProps } 
        />
      </Layout>
    );
  }
}

export default wrapper.withRedux(WrappedApp);
