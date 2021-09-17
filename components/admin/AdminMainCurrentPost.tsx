import * as React from 'react';
import { Segment } from "semantic-ui-react";
// styles //
import styles from "../../styles/admin/AdminMainCurrentPost.module.css";

export interface IAdminMainCurrentPostProps {
}

export const AdminMainCurrentPost: React.FC<IAdminMainCurrentPostProps> = (): JSX.Element => {
  return (
    <div className={ styles.adminMainCurrentPostWrapper }>
      <Segment textAlign="center">
        current post
      </Segment>
    </div>
  );
};

