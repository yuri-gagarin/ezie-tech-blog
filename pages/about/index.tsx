import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additional components //
import { AboutInfoCard } from '@/components/about/AboutInfoCard';
//
import styles from "@/styles/about/AboutPage.module.css";

interface IAboutPageProps {
}

const AboutPage: React.FunctionComponent<IAboutPageProps> = (props) => {
  return (
    <Grid className={ styles.aboutPageGrid }>
      <Grid.Row className={ styles.aboutHeaderRow }>
        <Grid.Column>
          <h1>About</h1>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <AboutInfoCard />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default AboutPage;
