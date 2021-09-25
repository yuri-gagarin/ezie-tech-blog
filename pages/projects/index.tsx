import * as React from 'react';
import { Container, Grid, Header, Icon, Segment } from "semantic-ui-react";
// redux imports //
import { wrapper } from "../../redux/store";
// types //
import type { Dispatch } from "redux";
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { ProjectAction } from "../../redux/_types/project/actionTypes";
import styles from "../../styles/projects/ProjectsPage.module.css";

interface IProjectsPageProps {

}

const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const dispatch: Dispatch<ProjectAction> = store.dispatch;
  return {
    props: {}
  }
});

const ProjectsPage: React.FunctionComponent<IProjectsPageProps> = (props): JSX.Element => {
  return (
    <Grid stackable divided className={ styles.projectsPageGrid }>
      <Grid.Row className={ styles.projectRow } columns={2}>
        <Grid.Column color="purple" width={ 8 }>
          <Segment className={ styles.titleSegment }>
            <Header>Project title</Header>
            <div>A project description here fefefe</div>
            <div></div>
          </Segment>
        </Grid.Column>
        <Grid.Column width={ 8 }>
          
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className={ styles.projectRow } columns={2}>
        <Grid.Column width={ 8 }>
        </Grid.Column>
        <Grid.Column color="purple" width={ 8 }>
          <Segment className={ styles.titleSegment }>
            <Header>Project title</Header>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ProjectsPage;
