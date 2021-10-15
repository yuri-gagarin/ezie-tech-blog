import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additional components //
import { AboutInfoCard } from '@/components/about/AboutInfoCard';
// types //
import type { GetStaticProps, GetStaticPropsResult } from "next";
import styles from "@/styles/about/AboutPage.module.css";
import { GeneralNotImlementedModal } from '@/components/modals/GenNotImplementedModal';

interface IStaticProps {
  emails: string[];
}
export const getStaticProps: GetStaticProps = async (): Promise<GetStaticPropsResult<IStaticProps>> => {

  return {
    props: {
      emails: [ "first@mail.com", "second@mail.com", "third@mail.com" ]
    }
  };
};

interface IAboutPageProps extends IStaticProps  {

}

const AboutPage: React.FunctionComponent<IAboutPageProps> = ({ emails }): JSX.Element => {
  // local state and hooks //
  const [ notImplOpen, setNotImplOpen ] = React.useState<boolean>(false);

  // action handlers //
  const dismissNotImpModal = (): void => {
    setNotImplOpen(false);
  };
  const handleOpenContactForm = (e: React.MouseEvent<HTMLButtonElement>): void => {

  };
  const handleToggleFollow = (): void => {
    // NOT available yet //
    setNotImplOpen(true);
  }

  return (
    <Grid className={ styles.aboutPageGrid }>
      <GeneralNotImlementedModal 
        modalOpen={ notImplOpen }  
        dismissNotImpModal = { dismissNotImpModal }
      />
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
          {
            emails && emails.map((email) => {
              return (
                <AboutInfoCard
                  key={ email }
                  handleOpenContactForm={ handleOpenContactForm }
                  handleToggleFollow={ handleToggleFollow }
                />
              )
            })
          }
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default AboutPage;
