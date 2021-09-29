import * as React from 'react';
// additional libraries //
import { Grid, Header, Segment } from "semantic-ui-react";
import Lightbox from 'react-image-lightbox';
import ReactMarkdown from 'react-markdown/react-markdown.min';
// next imports/ /
import NextImage from "next/image";
// redux imports //
import { useSelector } from "react-redux";
import { wrapper } from "../../redux/store";
import { ProjectActions } from '../../redux/actions/projectActions';
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
  const [ imgModalState, setImgModalState ] = React.useState<ImgModalState>({ isOpen: false, photoIndex: 0 });
  const [ imgUrls, setImgUrls ] = React.useState<string[]>(["/images/blog1.jpg", "/images/blog1.jpg", "/images/blog1.jpg"]);
  // redux hooks and state //
  const { projectsArr } = useSelector((state: IGeneralState) => state.projectsState);
  // custom hooks //
  const { width } = useWindowSize();

  // action handlers //
  const handleOpenImgModal = (imgUrl: string): void => {
    setImgModalState({ ...imgModalState, isOpen: true });
  }
  const handleCloseImgModal = (): void => {
    setImgModalState({ ...imgModalState, isOpen: false });
  };
  const handleGoToPrevious = (): void => {
    const { photoIndex } = imgModalState;
    const nextIndex = (photoIndex + imgUrls.length - 1) % imgUrls.length;
    setImgModalState({ ...imgModalState, photoIndex: nextIndex });
  };
  const handleGoToNext = (): void => {
    const { photoIndex } = imgModalState;
    const nextIndex = (photoIndex + 1) % imgUrls.length;
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
            mainSrc={ imgUrls[imgModalState.photoIndex] }
            nextSrc={ imgUrls[(imgModalState.photoIndex + 1) % imgUrls.length] }
            prevSrc={ imgUrls[(imgModalState.photoIndex + imgUrls.length - 1) % imgUrls.length] }
            onCloseRequest={ handleCloseImgModal }
            onMovePrevRequest={ handleGoToPrevious }
            onMoveNextRequest={ handleGoToNext }
          />
        )
      }
      {
        projectsArr.map((project, i) => {
          return (
            i % 2 == 0
            ?
            <Grid.Row columns={2} key={ project._id}>
              <Grid.Column color="purple" width={ 8 }>
                <Segment className={ styles.titleSegment }>
                  <Header>{ project.title }</Header>
                  <div>{ project.description }</div>
                  <div className={ styles.techDiv }>
                    <div className={ styles.techDivHeader }>Languages</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.languages.js ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/javascript.svg" alt="js"></NextImage></div> : null }
                      { project.languages.ts ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/typescript.svg" alt="ts"></NextImage></div> : null }
                      { project.languages.python ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/python.svg" alt="python"></NextImage></div> : null }
                      { project.languages.ruby ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/ruby.svg" alt="ruby"></NextImage></div> : null }
                      { project.languages.cSharp ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/cSharp.svg" alt="c#"></NextImage></div> : null }
                      { project.languages.goLang ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/go_lang.svg" alt="go"></NextImage></div> : null }
                    </div>
                    <div className={ styles.techDivHeader }>Libraries</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.libraries.react ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/react.svg" alt="React"></NextImage></div> : null }
                      { project.libraries.reactNative ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/react_native.svg" alt="React Native"></NextImage></div> : null }
                      { project.libraries.redux ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/redux.svg" alt="Redux"></NextImage></div> : null }
                      { project.libraries.bootstrap ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/bootstrap.svg" alt="Bootstrap"></NextImage></div> : null }
                      { project.libraries.semanticUI ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/semantic_ui.svg" alt="SemanticUI"></NextImage></div> : null }
                      { project.libraries.materialUI ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/material_ui.svg" alt="MaterialUI"></NextImage></div> : null }
                      { project.libraries.socketIO ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/socket_io.svg" alt="SocketIO"></NextImage></div> : null }
                    </div>
                    <div className={ styles.techDivHeader }>Frameworks</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.frameworks.nextJS ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/nextjs.svg" alt="NextJs"></NextImage></div> : null }
                      { project.frameworks.gatsbyJS ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/gatsby.svg" alt="GatsbyJs"></NextImage></div> : null }
                      { project.frameworks.rails ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/rails.svg" alt="Rails"></NextImage></div> : null }
                      { project.frameworks.django ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/django.svg" alt="Django"></NextImage></div> : null }
                      { project.frameworks.flask ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/flask.svg" alt="Flask"></NextImage></div> : null }
                      { project.frameworks.ASP ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/aspNET.svg" alt="Asp.NET"></NextImage></div> : null }
                    </div>

                  </div>
                </Segment>
                <Segment className={ styles.imageSegment }>
                  <div>
                    <NextImage onClick={ () => handleOpenImgModal("/images/blog1.jpg") } layout="fill"  src="/images/blog1.jpg" alt="project first image" />
                  </div>
                  <div>
                    <NextImage layout="fill"  src="/images/blog1.jpg" alt="project second image" />
                  </div>
                  <div>
                    <NextImage layout="fill"  src="/images/blog1.jpg" alt="project third image" />
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column width={ 8 }>
                <Segment className={ styles.projectDetailsSegment }>
                  <div className={ styles.projectDetailsHeader }>
                    <div className={ styles.projectDetailsHeaderTitle }>Challenges</div>
                    <div className={ styles.projectDetailsContent }>
                      <ReactMarkdown children={ project.challenges } />
                    </div>
                  </div>
                  <div className={ styles.projectDetailsHeader }>
                    <div className={ styles.projectDetailsHeaderTitle }>Solutions</div>
                    <div className={ styles.projectDetailsContent }>
                      <ReactMarkdown children={ project.solution } />
                    </div>
                  </div>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            :
            (
              width > 768 
              ? 
              <Grid.Row className={ styles.projectRow } columns={2} key={ project._id }>
              <Grid.Column width={ 8 }>
                <Segment className={ styles.projectDetailsSegment }>
                  <div className={ styles.projectDetailsHeader }>
                    <div className={ styles.projectDetailsHeaderTitle }>Challenges</div>
                    <div className={ styles.projectDetailsContent }>
                      <ReactMarkdown children={ project.challenges } />
                    </div>
                  </div>
                  <div className={ styles.projectDetailsHeader }>
                    <div className={ styles.projectDetailsHeaderTitle }>Solutions</div>
                    <div className={ styles.projectDetailsContent }>
                      <ReactMarkdown children={ project.solution } />
                    </div>
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column color="purple" width={ 8 }>
              <Segment className={ styles.titleSegment }>
                  <Header>{ project.title }</Header>
                  <div>{ project.description }</div>
                  <div className={ styles.techDiv }>
                    <div className={ styles.techDivHeader }>Languages</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.languages.js ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/javascript.svg" alt="js"></NextImage></div> : null }
                      { project.languages.ts ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/typescript.svg" alt="ts"></NextImage></div> : null }
                      { project.languages.python ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/python.svg" alt="python"></NextImage></div> : null }
                      { project.languages.ruby ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/ruby.svg" alt="ruby"></NextImage></div> : null }
                      { project.languages.cSharp ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/cSharp.svg" alt="c#"></NextImage></div> : null }
                      { project.languages.goLang ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/go_lang.svg" alt="go"></NextImage></div> : null }
                    </div>
                    <div className={ styles.techDivHeader }>Libraries</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.libraries.react ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/react.svg" alt="React"></NextImage></div> : null }
                      { project.libraries.reactNative ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/react_native.svg" alt="React Native"></NextImage></div> : null }
                      { project.libraries.redux ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/redux.svg" alt="Redux"></NextImage></div> : null }
                      { project.libraries.bootstrap ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/bootstrap.svg" alt="Bootstrap"></NextImage></div> : null }
                      { project.libraries.semanticUI ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/semantic_ui.svg" alt="SemanticUI"></NextImage></div> : null }
                      { project.libraries.materialUI ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/material_ui.svg" alt="MaterialUI"></NextImage></div> : null }
                      { project.libraries.socketIO ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/socket_io.svg" alt="SocketIO"></NextImage></div> : null }
                    </div>
                    <div className={ styles.techDivHeader }>Frameworks</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.frameworks.nextJS ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/nextjs.svg" alt="NextJs"></NextImage></div> : null }
                      { project.frameworks.gatsbyJS ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/gatsby.svg" alt="GatsbyJs"></NextImage></div> : null }
                      { project.frameworks.rails ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/rails.svg" alt="Rails"></NextImage></div> : null }
                      { project.frameworks.django ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/django.svg" alt="Django"></NextImage></div> : null }
                      { project.frameworks.flask ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/flask.svg" alt="Flask"></NextImage></div> : null }
                      { project.frameworks.ASP ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/aspNET.svg" alt="Asp.NET"></NextImage></div> : null }
                    </div>

                  </div>
                </Segment>
                <Segment className={ styles.imageSegment }>
                  <div>
                    <NextImage layout="fill"  src="/images/blog1.jpg" alt="project first image" />
                  </div>
                  <div>
                    <NextImage layout="fill"  src="/images/blog1.jpg" alt="project second image" />
                  </div>
                  <div>
                    <NextImage layout="fill"  src="/images/blog1.jpg" alt="project third image" />
                  </div>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            :
            <Grid.Row columns={2} key={ project._id}>
              <Grid.Column color="purple" width={ 8 }>
                <Segment className={ styles.titleSegment }>
                  <Header>{ project.title }</Header>
                  <div>{ project.description }</div>
                  <div className={ styles.techDiv }>
                    <div className={ styles.techDivHeader }>Languages</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.languages.js ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/javascript.svg" alt="js"></NextImage></div> : null }
                      { project.languages.ts ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/typescript.svg" alt="ts"></NextImage></div> : null }
                      { project.languages.python ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/python.svg" alt="python"></NextImage></div> : null }
                      { project.languages.ruby ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/ruby.svg" alt="ruby"></NextImage></div> : null }
                      { project.languages.cSharp ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/cSharp.svg" alt="c#"></NextImage></div> : null }
                      { project.languages.goLang ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/go_lang.svg" alt="go"></NextImage></div> : null }
                    </div>
                    <div className={ styles.techDivHeader }>Libraries</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.libraries.react ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/react.svg" alt="React"></NextImage></div> : null }
                      { project.libraries.reactNative ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/react_native.svg" alt="React Native"></NextImage></div> : null }
                      { project.libraries.redux ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/redux.svg" alt="Redux"></NextImage></div> : null }
                      { project.libraries.bootstrap ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/bootstrap.svg" alt="Bootstrap"></NextImage></div> : null }
                      { project.libraries.semanticUI ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/semantic_ui.svg" alt="SemanticUI"></NextImage></div> : null }
                      { project.libraries.materialUI ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/material_ui.svg" alt="MaterialUI"></NextImage></div> : null }
                      { project.libraries.socketIO ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/socket_io.svg" alt="SocketIO"></NextImage></div> : null }
                    </div>
                    <div className={ styles.techDivHeader }>Frameworks</div>
                    <div className={ styles.svgLogosDiv }>
                      { project.frameworks.nextJS ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/nextjs.svg" alt="NextJs"></NextImage></div> : null }
                      { project.frameworks.gatsbyJS ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/gatsby.svg" alt="GatsbyJs"></NextImage></div> : null }
                      { project.frameworks.rails ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/rails.svg" alt="Rails"></NextImage></div> : null }
                      { project.frameworks.django ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/django.svg" alt="Django"></NextImage></div> : null }
                      { project.frameworks.flask ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/flask.svg" alt="Flask"></NextImage></div> : null }
                      { project.frameworks.ASP ? <div className={ styles.logoImgDiv }><NextImage height="100%" width="100%" src="/logos/tech_logos/aspNET.svg" alt="Asp.NET"></NextImage></div> : null }
                    </div>

                  </div>
                </Segment>
                <Segment className={ styles.imageSegment }>
                  <div>
                    <NextImage layout="fill"  src="/images/blog1.jpg" alt="project first image" />
                  </div>
                  <div>
                    <NextImage layout="fill"  src="/images/blog1.jpg" alt="project second image" />
                  </div>
                  <div>
                    <NextImage layout="fill"  src="/images/blog1.jpg" alt="project third image" />
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column width={ 8 }>
                <Segment className={ styles.projectDetailsSegment }>
                  <div className={ styles.projectDetailsHeader }>
                    <div className={ styles.projectDetailsHeaderTitle }>Challenges</div>
                    <div className={ styles.projectDetailsContent }>
                      <ReactMarkdown children={ project.challenges } />
                    </div>
                  </div>
                  <div className={ styles.projectDetailsHeader }>
                    <div className={ styles.projectDetailsHeaderTitle }>Solutions</div>
                    <div className={ styles.projectDetailsContent }>
                      <ReactMarkdown children={ project.solution } />
                    </div>
                  </div>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            )
          )
        })
      }
    </Grid>
  );
};

export default ProjectsPage;
