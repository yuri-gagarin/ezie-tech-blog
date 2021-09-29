import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';
// styles //
import styles from "@/styles/admin/forms/AdminFileInput.module.css";

interface IAdminFileInputProps {
  handleUploadPic(file: File): void;
}

type LocalState = {
  file: File | null;
}

export const AdminFileInput: React.FunctionComponent<IAdminFileInputProps> = ({ handleUploadPic }): JSX.Element => {
  const [ localState, setLocalState ] = React.useState<LocalState>({ file: null });
  const fileInputRef: React.MutableRefObject<HTMLInputElement> | null = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files[0];
    setLocalState((s) => ({ ...s, file }));
  };
  const handleUpload = (): void => {
    handleUploadPic(localState.file);
  };
  const cancelUpload = (): void => {
    setLocalState((s) => ({ ...s, file: null }));
  };

  return (
    <div>
      {
        localState.file 
        ?
        <Button.Group>
          <Button basic color="orange" onClick={ cancelUpload }>
            <Icon name="remove" color="orange" />
            Cancel
          </Button>
          <Button color="green" onClick={ handleUpload }>
            <Icon name="upload" />
            Upload
          </Button>
        </Button.Group>
        :
        <Button basic color="green" onClick={ () => fileInputRef.current.click() }>
          <Icon name="file" color="green" />
          Choose File
        </Button>
      }
      <input 
        ref={ fileInputRef }
        type="file"
        hidden={ true }
        onChange= { handleFileChange }
      />
      {
        localState.file
        ?
        <span>{ localState.file.name }</span>
        :
        <span>No file selected</span>
      }
    </div>
  );
};

