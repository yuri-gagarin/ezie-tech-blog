import React from "react";
import { Grid, Segment } from "semantic-ui-react";
// styles //
import blogHeaderStyle from "../../styles/blog/BlogHeader.module.css";

export const BlogHeader: React.FC<{}> = (): JSX.Element => {

  return (
    <Grid.Row className={ blogHeaderStyle.headerRow }>
      <div className={ blogHeaderStyle.headerSegment }>
        <span>Everything and anything</span><span>DEV</span><span>related</span>
      </div>
      <div className={ blogHeaderStyle.descSegment}>
        Or how we stopped worrying and learned to love NodeJS and React
      </div>
    </Grid.Row>
  );
};
