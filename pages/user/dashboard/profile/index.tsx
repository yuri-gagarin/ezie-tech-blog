import * as React from 'react';
import { Button, Card, Grid, Label, Segment } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
// heplers //

// styles //
import styles from "@/styles/user/UserProfileIndex.module.css";
// type imports //
import type { IGeneralState } from '@/redux/_types/generalTypes';

interface IUserProfileIndexProps {
}

const UserProfileIndex: React.FunctionComponent<IUserProfileIndexProps> = (props): JSX.Element => {
  // local component state //
  const [ editModalOpen, setEditModalOpen ] = React.useState<boolean>(false);
  // redux hooks //
  const { authState } = useSelector((state: IGeneralState) => state);
  const { currentUser } = authState;

  const handleOpenEditModal = (): void => {
    setEditModalOpen(false);
  };
  


  return (
    <React.Fragment>
      <Grid.Row className={ styles.headerRow }> 
        <Segment style={{ heigth: "100%", width: "100%"}} textAlign="center">User Profile Section</Segment>
      </Grid.Row>
      <Grid.Row>
        <Button.Group>
          <Button basic content="Edit Profile" color="green" icon="edit" />
        </Button.Group>
      </Grid.Row>
      <Grid.Row className={ styles.contentRow }>
        <Segment className={ styles.userContentSegment }>
          <div>
            <Label className={ styles.userContentLabel }>First Name:</Label><span>{ currentUser.firstName || "Did not provide first name yet..." }</span>
          </div>
          <div>
            <Label className={ styles.userContentLabel }>Last Name:</Label><span>{ currentUser.lastName || "Did not provide last name yet..." }</span>
          </div>
          <div>
            <Label className={ styles.userContentLabel }>Email:</Label><span>{ currentUser.email }</span>
          </div>
          <div>
            <Label className={ styles.userContentLabel }>Registered:</Label><span>{ currentUser.createdAt }</span>
          </div>
          <Button content="Change Password" />
        </Segment>
      </Grid.Row>
    </React.Fragment>
  );
};

export default UserProfileIndex;
