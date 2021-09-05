import * as React from 'react';
import { Dropdown, DropdownItemProps, Icon, Menu } from "semantic-ui-react";
// 
import styles from "../../styles/blog/BlogSortControls.module.css";

interface IBlogSortControlsProps {

}

type DropDownValue = "New" | "Old" | "Most Read";
type LocalState = {
  dropdownValue: DropDownValue;
}

export const BlogSortControls: React.FunctionComponent<IBlogSortControlsProps> = (props): JSX.Element => {
  const [ localState, setLocalState ] = React.useState<LocalState>({ dropdownValue: "New" });

  const handlePostSortClick = (_, data: DropdownItemProps): void => {
    const value = data.value as DropDownValue;
    setLocalState({ dropdownValue: value });
  };
  
  return (
    <Menu fluid> 
      <Menu.Menu>
        <Dropdown pointing text={`View ${localState.dropdownValue}`} className={ styles.dropdownMenu }>
          <Dropdown.Menu >
            <Dropdown.Item value="New" onClick={ handlePostSortClick }>
              <Icon name="clock" />
              New
            </Dropdown.Item>
            <Dropdown.Item value="Old" onClick={ handlePostSortClick }>
              <Icon name="clock" />
              Old
            </Dropdown.Item>
          </Dropdown.Menu>
      </Dropdown>
      </Menu.Menu>
      
    </Menu>
  );
};

