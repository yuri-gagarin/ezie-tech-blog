import * as React from 'react';
import { Grid } from 'semantic-ui-react';
// styles //
import homeTechStyle from "../../styles/home/HomeTech.module.css";

interface IHomeTechProps {
}

export const HomeTech: React.FunctionComponent<IHomeTechProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ homeTechStyle.homeTechRow }> 
      <div className={ homeTechStyle.techTitleDiv }>
        Our Tech
      </div>
      <div className={ homeTechStyle.techDescDiv }>
        We include latest popular languages and libraries including but not limited to:
      </div>
      <div className={ homeTechStyle.techLogoDiv }>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/react.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/react_native.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/redux.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/nextjs.svg" />
        </div>
      </div>
      <div className={ homeTechStyle.techLogoDiv }>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/javascript.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/typescript.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/css3.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/html5.svg" />
        </div>
      </div>
      <div className={ homeTechStyle.techLogoDiv }>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/nodejs.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/mongodb.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/rails.svg" />
        </div>
        <div className={ homeTechStyle.logoImg }>
          <img src="/logos/tech_logos/postgres.svg" />
        </div>
      </div>
    </Grid.Row>
  );
};

