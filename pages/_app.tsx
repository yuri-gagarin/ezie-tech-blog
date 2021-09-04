import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps, children }) {
  return (
    <Layout>
      <Component {...pageProps } />
    </Layout>
  );
};

export default MyApp;
