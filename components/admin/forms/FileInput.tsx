import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';
// styles //
import styles from "@/styles/admin/forms/AdminFileInput.module.css";

interface IAdminFileInputProps {
  handleUploadPic(): void;
}

type LocalState = {
  file: File | null;
}

const AdminFileInput: React.FunctionComponent<IAdminFileInputProps> = ({ handleUploadPic }): JSX.Element => {
  const [ localState, setLocalState ] = React.useState<LocalState>({ file: null });
  const fileInputRef: React.MutableRefObject<HTMLInputElement> | null = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files[0];
    setLocalState((s) => ({ ...s, file }));
  };

  return (
    <div>
      <Button onClick={ handleUploadPic }>
        <Icon name="file" color="green" />
        Choose File
      </Button>
      <input 
        ref={ fileInputRef }
        type="file"
        hidden={ true }
        onChange= { handleFileChange }
      />
    </div>
  );
};

export default AdminFileInput;
