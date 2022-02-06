import React from "react";
import NProgress from "nprogress";
// next imports //
import App, { AppInitialProps, AppContext } from "next/app";
import Router, { useRouter } from "next/router";
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
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserLayout } from "@/components/user/UserLayout";

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

    if(Router.route.includes("user")) {
      this.setState({ layoutRender: "user" });
    } else if (Router.route.includes("admin")) {
      this.setState({ layoutRender: "admin" });
    } else {
      this.setState({ layoutRender: "public" });
    }

  }
  
  public render () {
    const { Component, pageProps } = this.props;
    const { firebaseContInstance, layoutRender } = this.state;
    console.log(this.state)

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
