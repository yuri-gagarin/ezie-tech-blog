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
        <div className={ styles.aboutDivContent }>
          <h4>Technology doesn&apos;t have to be confusing</h4>
        </div>
      </div>
      <div className={ styles.aboutDescriptionDiv }>
        <div className={ styles.descriptionWrapper }>
          <div className={ styles.descriptionContent }>
            A small constantly changing team of individuals looking to learn, teach, create and develop. 
            We work with various current technologies depending on the scope and demand of the project.
            Also theres a cat but he&apos;s not too friendly.
          </div>
        </div>
      </div>
    </Grid.Row>
  );
};
