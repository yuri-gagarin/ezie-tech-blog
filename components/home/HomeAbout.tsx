import * as React from 'react';
import { Grid } from 'semantic-ui-react';
// styles //
import styles from "@/styles/home/HomeAbout.module.css";

interface IHomeAboutProps {
}

export const HomeAbout: React.FunctionComponent<IHomeAboutProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ styles.wrapperRow }>
      <div className={ styles.aboutDiv }>
       
      </div>
      <div className={ styles.aboutDescriptionDiv }>
        <div className={ styles.descriptionWrapper }>
          <div className={ styles.descriptionContent }>
            A small constantly changing team of individuals learning, teaching, and creating. 
            We work with various current technologies depending on the scope and demand of the project.
            Ideas are difficult, we make implementation easy.
          </div>
        </div>
      </div>
    </Grid.Row>
  );
};
