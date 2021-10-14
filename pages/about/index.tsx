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
        <h1>We are...</h1>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <p className={ styles.statementParagraph }>A short mission statement here about the general idea of the project.</p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <AboutInfoCard />
          <AboutInfoCard />
          <AboutInfoCard />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default AboutPage;
