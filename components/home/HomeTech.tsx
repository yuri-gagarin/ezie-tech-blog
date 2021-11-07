import * as React from 'react';
import { Grid } from 'semantic-ui-react';
// next imports //
import NextImage from "next/image";
// styles //
import homeTechStyle from "@/styles/home/HomeTech.module.css";

interface IHomeTechProps {

}

export const HomeTech: React.FunctionComponent<IHomeTechProps> = (props): JSX.Element => {

  return (
    <Grid.Row id="homeTechRow" className={ homeTechStyle.homeTechRow } data-test-id="Home_Tech_Component"> 
      <Grid.Column>
        <h4 className={ homeTechStyle.techTitleDiv }>
          Our Tech
        </h4>
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
            <NextImage src="/logos/tech_logos/python.svg" height="100%" width="100%" objectFit="contain" />
          </div>
          <div className={ homeTechStyle.logoImg }>
            <NextImage src="/logos/tech_logos/swift.svg" height="100%" width="100%" objectFit="contain" />
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
