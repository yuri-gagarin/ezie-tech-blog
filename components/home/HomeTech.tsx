import * as React from 'react';
import { Button, Grid } from 'semantic-ui-react';
//
import { useRouter } from 'next/router';
// styles //
import homeTechStyle from "../../styles/home/HomeTech.module.css";

interface IHomeTechProps {
}

export const HomeTech: React.FunctionComponent<IHomeTechProps> = (props): JSX.Element => {

  const router = useRouter();

  const handleGoToBlog = (): void => {
    router.push("/blog");
  };

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
      <div className={ homeTechStyle.techAdditionalDescDiv }>
        <div className={ homeTechStyle.techAdditionalDescDivContent }>
          The sheer amount of frameworks, options, languages, libraries can be overwhelming sometimes. It is often very hard to decide
          what and where to use. Read more about it in our blog below.
        </div>
        <div className={ homeTechStyle.techBlogBtn }>
          <Button color="purple" content="Blog" onClick={ handleGoToBlog } />
        </div>  
      </div>  
    </Grid.Row>
  );
};

