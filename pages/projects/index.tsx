import * as React from 'react';
// additional libraries //
import { Grid } from "semantic-ui-react";
import Lightbox from 'react-image-lightbox';
// redux imports //
import { useSelector } from "react-redux";
import { wrapper } from "../../redux/store";
import { ProjectActions } from '../../redux/actions/projectActions';
// additional components //
import { ProjectLeftAlign } from '@/components/projects/ProjectLeftAlign';
import { ProjectRightAlign } from '@/components/projects/ProjectRightAlign';
// types //
import type { Dispatch } from "redux";
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { IGeneralState } from '../../redux/_types/generalTypes';
import type { ProjectAction } from "../../redux/_types/projects/actionTypes";
// styles //
import styles from "../../styles/projects/ProjectsPage.module.css";
// helpers //
import { useWindowSize } from '../../components/_helpers/monitorWindowSize';

// TODO //
// this nees to be rewritten to take in child components in the return value instead of the long markup //

interface IProjectsPageProps {

}
type ImgModalState = {
  photoIndex: number;
  isOpen: boolean;
  imageURLs: string[];
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const dispatch: Dispatch<ProjectAction> = store.dispatch;
  try {
    await ProjectActions.handleGetAll({ dispatch });
  } catch (error) {
    console.log(error);
  }
  return {
    props: {}
  }
});

const ProjectsPage: React.FunctionComponent<IProjectsPageProps> = (): JSX.Element => {
  // local state //
  const [ imgModalState, setImgModalState ] = React.useState<ImgModalState>({ isOpen: false, photoIndex: 0 , imageURLs: [] });
  // redux hooks and state //
  const { projectsArr } = useSelector((state: IGeneralState) => state.projectsState);
  // custom hooks //
  const { width } = useWindowSize();

  // action handlers //
  const handleOpenImgModal = (imgUrl: string, imageURLs: string[]): void => {
    const photoIndex: number = imageURLs.indexOf(imgUrl);
    setImgModalState({  isOpen: true, photoIndex, imageURLs });
  }
  const handleCloseImgModal = (): void => {
    setImgModalState({ isOpen: false, photoIndex: 0, imageURLs: [] });
  };
  const handleGoToPrevious = (): void => {
    const { photoIndex, imageURLs } = imgModalState;
    const nextIndex = (photoIndex + imageURLs.length - 1) % imageURLs.length;
    setImgModalState({ ...imgModalState, photoIndex: nextIndex });
  };
  const handleGoToNext = (): void => {
    const { photoIndex, imageURLs } = imgModalState;
    const nextIndex = (photoIndex + 1) % imageURLs.length;
    setImgModalState({ ...imgModalState, photoIndex: nextIndex });
  };

  React.useEffect(() => {
    // images will load from firebase? maybe later??? //
    console.log(imgModalState);
  }, [ imgModalState ]);

  return (
    <Grid stackable divided className={ styles.projectsPageGrid }>
      {
        imgModalState.isOpen && (
          <Lightbox 
            mainSrc={ imgModalState.imageURLs[imgModalState.photoIndex] }
            nextSrc={ imgModalState.imageURLs[(imgModalState.photoIndex + 1) % imgModalState.imageURLs.length] }
            prevSrc={ imgModalState.imageURLs[(imgModalState.photoIndex + imgModalState.imageURLs.length - 1) % imgModalState.imageURLs.length] }
            onCloseRequest={ handleCloseImgModal }
            onMovePrevRequest={ handleGoToPrevious }
            onMoveNextRequest={ handleGoToNext }
          />
        )
      }
      <Grid.Row color="purple" style={{ wdith: "100%", height: "100px "}} />
      {
        projectsArr.map((projectData, i) => {
          return (
            i % 2 === 0
            ?
            <ProjectLeftAlign key={ projectData._id } project={ projectData } handleOpenImageModal={ handleOpenImgModal } />
            :
            (
              width < 768  /* needed to make everything flow nicely on mobile */
              ?
              <ProjectLeftAlign key={ projectData._id } project={ projectData } handleOpenImageModal={ handleOpenImgModal } />
              :
              <ProjectRightAlign key={ projectData._id } project={ projectData } handleOpenImageModal={ handleOpenImgModal } />
            )
          )
        })
      }
    </Grid>
  );
};

export default ProjectsPage;
