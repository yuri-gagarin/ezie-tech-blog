import * as React from 'react';
import { Checkbox, Label, Form, TextArea } from "semantic-ui-react"; 
// styles //
import styles from "@/styles/admin/projects/AdminProjectForm.module.css";
import { ProjectData, ProjectFormData } from 'redux/_types/projects/dataTypes';

interface IAdminProjectFormProps {
  projectData: ProjectData | null;
}

export const AdminProjectForm: React.FunctionComponent<IAdminProjectFormProps> = (props) => {
  return (
    <Form className={ styles.projectFormStyle }>
      <Form.Field width="16"> 
        <Label color="grey" content="Project Title:" />
        <input placeholder="Project title here..." />
        <Label color="grey" content="Project Title:" />
        <TextArea placeholder="Project description here..." />
      </Form.Field>
      <Form.Field>
        <Label className={ styles.additionalOptsLabel } color="purple" content="Languages Used:" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="JavaScript" value="js" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="TypeScript" value="ts" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Python" value="python" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Ruby" value="ruby" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="C#" value="cSharp" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Go" value="goLang" />
      </Form.Field>
      <Form.Field>
        <Label className={ styles.additionalOptsLabel } color="purple" content={ "Libraries Used:" } />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Bootstrap" value="bootstrap" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="SemanticUI" value="semanticUI" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="MaterialUI" value="materialUI" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="React" value="react" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Redux" value="redux" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="ReactNative" value="reactNative" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="jQuery" value="jquery" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="SocketIO" value="socketIO" />
      </Form.Field>
      <Form.Field>
        <Label className={ styles.additionalOptsLabel } color="purple" content="Frameworks Used:" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Rails" value="rails" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="NextJS" value="nextJS" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="GatsbyJS" value="gatsbyJS" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Django" value="django" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Flask" value="flask" />
        <Checkbox className={ styles.additionalOptsCheckbox } label="Asp.NET" value="ASP" />
      </Form.Field>
      <Form.Field>
        <Label color="teal" content="Challenges:" />
        <TextArea rows={10} />
      </Form.Field>
      <Form.Field>
        <Label color="teal" content="Solutions:" />
        <TextArea rows={10} />
      </Form.Field>
    </Form>
  );
};
