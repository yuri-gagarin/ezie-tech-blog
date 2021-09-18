import * as React from 'react';
import { Dimmer,  Loader, Segment } from "semantic-ui-react";

interface IGeneralLoadingSegementProps {

}

export const GeneralLoadingSegement: React.FunctionComponent<IGeneralLoadingSegementProps> = (props): JSX.Element => {
  return (
    <Segment style={{ height: "100%", width: "100%" }}>
      <Dimmer active inverted>
        <Loader inverted content='Loading' />
      </Dimmer>
    </Segment>
  );
};
