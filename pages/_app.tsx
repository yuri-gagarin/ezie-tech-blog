import React from "react";
import NProgress from "nprogress";
// next imports //
import App, { AppInitialProps, AppContext } from "next/app";
import NextRouter, { useRouter } from "next/router";
// redux imports //
import { wrapper, store } from "../redux/store";
// firebase for storage //
import FirebaseController from "../firebase/firebaseSetup";
// additional components //
import { AdminLayout } from "@/components/layout/AdminLayout";
import Layout from '../components/layout/Layout';
import { UserLayout } from "@/components/layout/UserLayout";
// types //
import type { Router } from "next/router";
import type { Store } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
// styles //
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import "nprogress/nprogress.css";
import 'react-image-lightbox/style.css'
import { NextComponentType, NextPageContext } from "next";

declare global {
  interface Window { Cypress: any; store: Store<IGeneralState>  }
}

interface IAppInitialState {
  firebaseContInstance: null | FirebaseController;
  layoutRender: "user" | "admin" | "public";
}

class WrappedApp extends App<AppInitialProps, any, IAppInitialState> {
  constructor(props: any) {
    super(props)
    this.state = {
      firebaseContInstance: new FirebaseController(),
      layoutRender: "public"
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

  // lifecycle //
  componentDidMount() {
    NProgress.configure({ showSpinner: true, easing: "ease", speed: 500 });
    NextRouter.events.on("routeChangeStart", () => {
      NProgress.start();
    });
    NextRouter.events.on("routeChangeComplete", () => {
      NProgress.done();
    });
    NextRouter.events.on("routeChangeError", () => {
      NProgress.done();
    });
    if (window && window.Cypress) {
      window.store = store; 
    }

    if(NextRouter.route.includes("user")) {
      this.setState({ layoutRender: "user" });
    } else if (NextRouter.route.includes("admin")) {
      this.setState({ layoutRender: "admin" });
    } else {
      this.setState({ layoutRender: "public" });
    }
  }
  
  shouldComponentUpdate(nextProps: Readonly<AppInitialProps & { Component: NextComponentType<NextPageContext<any>, any, any>; router: Router; __N_SSG?: boolean; __N_SSP?: boolean; }>, nextState: Readonly<IAppInitialState>, nextContext: any): boolean {
    const { route } = nextProps.router;

    if(route.includes("user") && nextState.layoutRender !== "user") {
      this.setState({ layoutRender: "user" });
    } else if (route.includes("admin") && nextState.layoutRender !== "admin") {
      this.setState({ layoutRender: "admin" });
    } else if ((!route.includes("admin") && !route.includes("user")) && nextState.layoutRender !== "public") {
      this.setState({ layoutRender: "public" });
    }
    return true;
  }
  
  public render () {
    const { Component, pageProps } = this.props;
    const { firebaseContInstance, layoutRender } = this.state;

    if (layoutRender === "admin") {
      return (
        <AdminLayout { ...pageProps }>
          <Component 
            firebaseContInstance={firebaseContInstance} 
            { ...pageProps } 
          />
        </AdminLayout>
      );
    } else if (layoutRender === "user") {
      return (
        <UserLayout { ...pageProps }>
          <Component 
            firebaseContInstance={firebaseContInstance} 
            { ...pageProps } 
          />
        </UserLayout>
      );
    } else {
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
}

export default wrapper.withRedux(WrappedApp);
