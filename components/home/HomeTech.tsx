import * as React from 'react';
import { Button, Grid } from 'semantic-ui-react';
// next imports //
import NextImage from "next/image";
// styles //
import homeTechStyle from "@/styles/home/HomeTech.module.css";

interface IHomeTechProps {

}

export const HomeTech: React.FunctionComponent<IHomeTechProps> = (props): JSX.Element => {

  return (
    <Grid.Row className={ homeTechStyle.homeTechRow } centered> 
      <Grid.Column>
        <div className={ homeTechStyle.techTitleDiv }>
          Our Tech
        </div>
        <div className={ homeTechStyle.techDescDiv }>
          We include latest popular languages and libraries including but not limited to:
        </div>
        <div className={ homeTechStyle.techLogoDiv }>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/react.svg" height="100%" width="100%" objectFit="contain"  />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/react_native.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/redux.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/nextjs.svg" height="100%" width="100%" objectFit="contain" />
          </div>
        </div>
        <div className={ homeTechStyle.techLogoDiv }>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/javascript.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/typescript.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/css3.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/html5.svg" height="100%" width="100%" objectFit="contain" />
          </div>
        </div>
        <div className={ homeTechStyle.techLogoDiv }>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/nodejs.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/mongodb.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/rails.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/postgres.svg" height="100%" width="100%" objectFit="contain" />
          </div>
        </div>
        <div className={ homeTechStyle.techAdditionalDescDiv }>
          <div className={ homeTechStyle.techAdditionalDescDivContent }>
            The sheer amount of frameworks, options, languages, libraries can be overwhelming sometimes. It is often very hard to decide
            what and where to use. Read more about it in our blog below.
          </div>
        </div>  
      </Grid.Column>
    </Grid.Row>
  );
};

