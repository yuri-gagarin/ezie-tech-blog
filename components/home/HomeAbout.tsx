import * as React from 'react';
import { Grid } from 'semantic-ui-react';
// styles //
import homeAboutStyles from "../../styles/home/HomeAbout.module.css";

interface IHomeAboutProps {
}

export const HomeAbout: React.FunctionComponent<IHomeAboutProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ homeAboutStyles.wrapperRow }>
      <div className={ homeAboutStyles.aboutDiv }>
        <span>We are </span>
      </div>
      <div className={ homeAboutStyles.aboutDescriptionDiv }>
        <div className={ homeAboutStyles.descriptionWrapper }>
          <div className={ homeAboutStyles.descriptionContent }>
            A small constantly changing team of individuals looking to learn, teach, create and develop. 
            We work with various current technologies depending on the scope and demand of the project.
            Also theres a cat but he's not too friendly.
          </div>
        </div>
      </div>
    </Grid.Row>
  );
};
