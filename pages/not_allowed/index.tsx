import * as React from 'react';
import { Header, Segment } from "semantic-ui-react";
// styles //
import styles from "../../styles/general_pages/NotAllowedPage.module.css";


interface INotAllowedPageProps {
}

const NotAllowedPage: React.FunctionComponent<INotAllowedPageProps> = (props) => {
  return (
    <div className={ styles.notAllowedPageWrapper }>
      <Segment style={{ width: "100%", height: "100%" }} textAlign="center">
        <Header>Not Allowed</Header>
      </Segment>
    </div>
  );
};

export default NotAllowedPage;
