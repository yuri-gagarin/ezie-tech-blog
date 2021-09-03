import { MainComponent } from '../components/Main';
import { NavMenu } from "../components/NavMenu";
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';

function MyApp({ Component, pageProps, children }) {
  return (
    <MainComponent>
      <NavMenu />
      <Component {...pageProps } />
    </MainComponent>
  );
};

export default MyApp;
