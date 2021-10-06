import * as React from 'react';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
// styles //
import styles from "@/styles/shared/GeneralLoadingComponent.module.css";

interface IGeneralLoadingComponentProps {
  loaderText?: string;
}

export const GeneralLoadingComponent: React.FunctionComponent<IGeneralLoadingComponentProps> = ({ loaderText }): JSX.Element => {
  return (
    <Container className={ styles.genLoaderContainer }>
      <Dimmer active inverted>
        <Loader 
          size="large"
          content={ loaderText || "Loading" }
          className={ styles.genLoaderSpinner }
        />
      </Dimmer>
    </Container>
  );
};

