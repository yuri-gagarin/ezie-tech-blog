import * as React from 'react';
import { Checkbox, Grid, Label, Form, TextArea } from "semantic-ui-react"; 
// additional components //
import { AdminFileInput } from '@/components/admin/forms/AdminFileInput';
import { AdminProjectsMenu } from "@/components/admin/projects/AdminProjectsMenu";
import { ImagePreviewCarousel } from '@/components/shared/ImagePreviewCarousel';
// types //
import type { CheckboxProps, TextAreaProps } from "semantic-ui-react";
import type { ProjectData } from 'redux/_types/projects/dataTypes';
// styles //
import styles from "@/styles/admin/projects/AdminProjectForm.module.css";
// helpers //
import { validateProjectForm } from "@/components/_helpers/validators";


const mockURLS = [
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300"
];


interface IAdminProjectFormProps {
  projectData: ProjectData | null;
  currentProjectImages: string[] | null;
  handleSaveProjectData(data: FormState): Promise<any>;
  handleMenuCancelBtnclick(): void;
  handleMenuPublishBtnClick(): Promise<boolean>;
  handleUploadProjectImage(file: File): Promise<any>;
  handleDeleteProjectImage(imageURL: string): Promise<any>;
}
type FormState = {
  title: string;
  description: string;
  languages: {
    js: boolean; ts: boolean; python: boolean; ruby: boolean; cSharp: boolean; goLang: boolean;
  };
  libraries: {
    bootstrap: boolean; semanticUI: boolean; materialUI: boolean; jquery: boolean; react: boolean; reactNative: boolean; redux: boolean; socketIO: boolean;
  };
  frameworks: {
    rails: boolean; nextJS: boolean; gatsbyJS: boolean; django: boolean; flask: boolean; ASP: boolean;
  };
  challenges: string;
  solution: string;
};

export const AdminProjectForm: React.FunctionComponent<IAdminProjectFormProps> = ({ projectData, currentProjectImages, handleSaveProjectData, handleMenuCancelBtnclick, handleMenuPublishBtnClick, handleUploadProjectImage, handleDeleteProjectImage }): JSX.Element => {
  // local form state //
  const [ formState, setFormState ] = React.useState<FormState>({
    title: projectData ? projectData.title : "",
    description: projectData ? projectData.description : "",
    languages: projectData && projectData.languages ? { ...projectData.languages } : { js: false, ts: false, python: false, ruby: false, cSharp: false, goLang: false },
    libraries: projectData && projectData.libraries ? { ...projectData.libraries } : { bootstrap: false, semanticUI: false, materialUI: false, jquery: false, react: false, reactNative: false, redux: false, socketIO: false },
    frameworks: projectData && projectData.frameworks ? { ...projectData.frameworks } : { rails: false, nextJS: false, gatsbyJS: false, django: false, flask: false, ASP: false },
    challenges: projectData && projectData.challenges ? projectData.challenges : "",
    solution: projectData && projectData.description ? projectData.description : ""
  });

  // action and event listeners //
  // input event listeners //
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState((s) => ({ ...s, title: e.target.value }));
  };
  const handleDescriptionChange = (_, data: TextAreaProps): void => {
    setFormState((s) => ({ ...s, description: data.value as string }));
  };
  const handleLangCheckboxChange = (_, data: CheckboxProps): void => {
    const { value, checked } = data;
    const languages = { ...formState.languages };
    languages[value as string] = checked;
    setFormState((s) => ({ ...s, languages }));
  };
  const handleLibCheckboxChange = (_, data: CheckboxProps): void => {
    const { value, checked } = data;
    const libraries = { ...formState.libraries };
    libraries[value as string] = checked;
    setFormState((s) => ({ ...s, libraries }));
  };
  const handleFrameworksCheckboxChange = (_, data: CheckboxProps): void => {
    const { value, checked } = data;
    const frameworks = { ...formState.frameworks };
    frameworks[value as string] = checked;
    setFormState((s) => ({ ...s, frameworks }));
  };
  const handleChallengesChange = (_, data: TextAreaProps): void => {
    setFormState((s) => ({ ...s, challenges: data.value as string }));
  };
  const handleSolutionChange = (_, data: TextAreaProps): void => {
    setFormState((s) => ({ ...s, solution: data.value as string }));
  };
  // form menu actions //
  const menuSaveBtnClick = async (): Promise<any> => {
    // validate correct input first //
    // TODO //
    // add an error message popup and live input validation //
    const { title, description, challenges, solution } = formState;
    const { valid, errorMessages } = validateProjectForm({ title, description, challenges, solution });
    if (!valid && errorMessages.length > 0) return;

    return await handleSaveProjectData(formState);
  };
  // END actions and event listeners //

  return (
    <Grid.Column largeScreen={16} style={{ paddingLeft: 0, paddingRight: 0 }}>
      <AdminProjectsMenu 
        menuSaveBtnClick={ menuSaveBtnClick }
        menuCancelBtnClick={ handleMenuCancelBtnclick }
        menuPublishClick={ handleMenuPublishBtnClick }
      />
      <Form className={ styles.projectFormStyle }>
        <Form.Field width="16"> 
          <Label color="grey" content="Project Title:" />
          <input placeholder="Project title here..." onChange={ handleTitleChange } value={ formState.title || ""} />
          <Label color="grey" content="Project Description:" />
          <TextArea placeholder="Project description here..." onChange={ handleDescriptionChange } value={ formState.description || "" } />
        </Form.Field>
        <Form.Field>
          <Label className={ styles.additionalOptsLabel } color="purple" content="Languages Used:" />
          <Checkbox className={ styles.additionalOptsCheckbox } label="JavaScript" value="js" onChange={ handleLangCheckboxChange } checked={ formState.languages.js } />
          <Checkbox className={ styles.additionalOptsCheckbox } label="TypeScript" value="ts" onChange={ handleLangCheckboxChange } checked={ formState.languages.ts } />
          <Checkbox className={ styles.additionalOptsCheckbox } label="Python" value="python" onChange={ handleLangCheckboxChange } checked={ formState.languages.python } />
          <Checkbox className={ styles.additionalOptsCheckbox } label="Ruby" value="ruby" onChange={ handleLangCheckboxChange } checked={ formState.languages.ruby } />
          <Checkbox className={ styles.additionalOptsCheckbox } label="C#" value="cSharp" onChange={ handleLangCheckboxChange } checked={ formState.languages.cSharp } />
          <Checkbox className={ styles.additionalOptsCheckbox } label="Go" value="goLang" onChange={ handleLangCheckboxChange } checked={ formState.languages.goLang } />
        </Form.Field>
        <Form.Field>
          <Label className={ styles.additionalOptsLabel } color="purple" content={ "Libraries Used:" } />
          <Checkbox className={ styles.additionalOptsCheckbox } label="Bootstrap" value="bootstrap" onChange={ handleLibCheckboxChange } checked={ formState.libraries.bootstrap }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="SemanticUI" value="semanticUI" onChange={ handleLibCheckboxChange } checked={ formState.libraries.semanticUI }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="MaterialUI" value="materialUI" onChange={ handleLibCheckboxChange } checked={ formState.libraries.materialUI }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="React" value="react" onChange={ handleLibCheckboxChange } checked={ formState.libraries.react }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="Redux" value="redux" onChange={ handleLibCheckboxChange } checked={ formState.libraries.redux }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="ReactNative" value="reactNative" onChange={ handleLibCheckboxChange } checked={ formState.libraries.reactNative }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="jQuery" value="jquery" onChange={ handleLibCheckboxChange } checked={ formState.libraries.jquery }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="SocketIO" value="socketIO" onChange={ handleLibCheckboxChange } checked={ formState.libraries.socketIO }/>
        </Form.Field>
        <Form.Field>
          <Label className={ styles.additionalOptsLabel } color="purple" content="Frameworks Used:" />
          <Checkbox className={ styles.additionalOptsCheckbox } label="Rails" value="rails" onChange={ handleFrameworksCheckboxChange } checked={ formState.frameworks.rails }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="NextJS" value="nextJS" onChange={ handleFrameworksCheckboxChange } checked={ formState.frameworks.nextJS }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="GatsbyJS" value="gatsbyJS" onChange={ handleFrameworksCheckboxChange } checked={ formState.frameworks.gatsbyJS }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="Django" value="django" onChange={ handleFrameworksCheckboxChange } checked={ formState.frameworks.django }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="Flask" value="flask" onChange={ handleFrameworksCheckboxChange } checked={ formState.frameworks.flask }/>
          <Checkbox className={ styles.additionalOptsCheckbox } label="Asp.NET" value="ASP" onChange={ handleFrameworksCheckboxChange } checked={ formState.frameworks.ASP }/>
        </Form.Field>
        {
          projectData
          ?
            <React.Fragment>
              <Form.Field>
                <AdminFileInput handleUploadPic={ handleUploadProjectImage } />
              </Form.Field>
              {
                currentProjectImages && currentProjectImages.length > 0
                  ?
                  <Form.Field>
                    <ImagePreviewCarousel imageURLs={ currentProjectImages } handleDeleteProjectImage={ handleDeleteProjectImage } />
                  </Form.Field>
                  :
                  null
              }
              
            </React.Fragment>
          :
            null
        }
        :
        <Form.Field>
          <Label color="teal" content="Challenges:" />
          <TextArea rows={10} onChange={ handleChallengesChange } value={ formState.challenges } />
        </Form.Field>
        <Form.Field>
          <Label color="teal" content="Solutions:" />
          <TextArea rows={10} onChange={ handleSolutionChange } value={ formState.solution } />
        </Form.Field>
      </Form>
    </Grid.Column>
  );
};
