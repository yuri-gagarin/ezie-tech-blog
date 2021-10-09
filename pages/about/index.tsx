import * as React from 'react';
import { Grid } from "semantic-ui-react";
//
import styles from "@/styles/about/AboutPage.module.css";

interface IAboutPageProps {
}

const AboutPage: React.FunctionComponent<IAboutPageProps> = (props) => {
  return (
    <Grid className={ styles.aboutPageGrid }>
      <Grid.Row>
        <div>
          About
        </div>
      </Grid.Row>
    </Grid>
  );
};

export default AboutPage;
