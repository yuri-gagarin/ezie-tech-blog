import React from "react";
import NProgress from "nprogress";
// next imports //
import { AppProps } from "next/app";
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { wrapper, store } from "../redux/store";
// firebase for storage //
import FirebaseController from "../firebase/firebaseSetup";
// additional components //
import { AdminLayout } from "@/components/layout/AdminLayout";
import Layout from '../components/layout/Layout';
import { UserLayout } from "@/components/layout/UserLayout";
import { LoginStatusModal } from "@/components/modals/LoginStatusModal";
// types //
import type { NextPage } from "next";
import type { Dispatch, Store } from "redux";
import type { IGeneralAppAction, IGeneralState } from "@/redux/_types/generalTypes";
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
  layoutRender: "user" | "admin" | "public";
}

const App: NextPage<AppProps & any> = ({ Component, pageProps, }) => {
  const [ initialState, setInitialState ] = React.useState<IAppInitialState>({ firebaseContInstance: new FirebaseController(), layoutRender: "public" });
  const [ loginstStatusModal, setLoginStatusModal ] = React.useState<boolean>(false);
  // next hooks //
  const router = useRouter();
  // redux hooks //
  const dispatch: Dispatch<IGeneralAppAction> = useDispatch();
  const { authState } = useSelector((s: IGeneralState) => s);

  React.useEffect(() => {
    NProgress.configure({ showSpinner: true, easing: "ease", speed: 500 });
    router.events.on("routeChangeStart", () => {
      NProgress.start();
    });
    router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });
    router.events.on("routeChangeError", () => {
      NProgress.done();
    });
    if (window && window.Cypress) {
      window.store = store; 
    }

    if(router.route.includes("user")) {
      setInitialState((s) => ({ ...s, layoutRender: "user" }));
    } else if (router.route.includes("admin")) {
      setInitialState((s) => ({ ...s, layoutRender: "admin" }));
    } else {
      setInitialState((s) => ({ ...s, layoutRender: "public" }));
    }
  }, [ router ]);

  React.useEffect(() => {
    if(router.route.includes("user") && initialState.layoutRender !== "user") {
      setInitialState((s) => ({ ...s, layoutRender: "user" }));
    } else if (router.route.includes("admin") && initialState.layoutRender !== "admin") {
      setInitialState((s) => ({ ...s, layoutRender: "admin" }));
    } else if ((!router.route.includes("admin") && !router.route.includes("user")) && initialState.layoutRender !== "public") {
      setInitialState((s) => ({ ...s, layoutRender: "public" }));
    }

  }, [ router.route, initialState ]);

  return (
    <React.Fragment>
      <LoginStatusModal 
        authState={ authState }
        dispatch={ dispatch }
      />
      {
        initialState.layoutRender === "public" 
        ?
        <Layout { ...pageProps }>
          <Component 
            firebaseContInstance={ initialState.firebaseContInstance } 
            { ...pageProps } 
          />
        </Layout>
        :
        (
          initialState.layoutRender === "admin" 
          ? 
            <AdminLayout { ...pageProps }>
              <Component 
                firebaseContInstance={ initialState.firebaseContInstance }  
                { ...pageProps } 
              />
            </AdminLayout>
          :
            <UserLayout { ...pageProps }>
              <Component 
                firebaseContInstance={ initialState.firebaseContInstance } 
                { ...pageProps } 
              />
            </UserLayout>
        )
      }
    </React.Fragment>
  )
};

App.getInitialProps = wrapper.getInitialAppProps((store) => async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps ? await Component.getInitialProps({...ctx, store }) : { content: "This really should be changed" }),
      pathname: ctx.pathname
    },
  };
});

export default wrapper.withRedux(App);

/*
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
*/


