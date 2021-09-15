import * as React from 'react';
import { Dropdown, DropdownItem, DropdownItemProps, Icon, Menu } from "semantic-ui-react";
// 
import axiosInstance from "../axios/axiosInstance";
import { AxiosRequestConfig } from "axios";
import styles from "../../styles/blog/BlogSortControls.module.css";

interface IBlogSortControlsProps {

}

type DropDownValue = "New" | "Old" | "Most Read";
type CategoriesValue = "All" | "Informational" | "Begginner" | "Intermediate" | "Expert";
type LocalState = {
  dropdownValue: DropDownValue;
  categoriesValue: CategoriesValue;
}

export const BlogSortControls: React.FunctionComponent<IBlogSortControlsProps> = (props): JSX.Element => {
  const [ localState, setLocalState ] = React.useState<LocalState>({ dropdownValue: "New", categoriesValue: "All" });

  const handlePostSortClick = async (_, data: DropdownItemProps): Promise<void> => {
    const value = data.value as DropDownValue;
    setLocalState({ ...localState, dropdownValue: value });
    const req: AxiosRequestConfig = {
      method: "GET",
      url: "/api/test"
    }
    try {
      await axiosInstance(req)
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostCategorySortClick = async (_, data: DropdownItemProps): Promise<void> => {
    const value = data.value as CategoriesValue;
    setLocalState({ ...localState, categoriesValue: value });
  };
  
  return (
    <Menu fluid> 
        <Dropdown pointing text={`Sort by: ${localState.dropdownValue}`} className={ styles.dropdownMenu }>
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
        <Dropdown pointing text={`View ${localState.categoriesValue}`} className={ styles.dropdownMenu }>
          <Dropdown.Menu >
            <Dropdown.Item value="All" onClick={ handlePostCategorySortClick }>
              All Posts
            </Dropdown.Item>
            <Dropdown.Item value="Informational" onClick={ handlePostCategorySortClick }>
              Informational Posts
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item value="Beginner" onClick={ handlePostCategorySortClick }>
              Beginner Posts
            </Dropdown.Item> 
            <Dropdown.Item value="Intermediate" onClick={ handlePostCategorySortClick }>
              Intermediate Posts
            </Dropdown.Item>
            <Dropdown.Item value="Expert" onClick={ handlePostCategorySortClick }>
              Expert Posts
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    </Menu>
  );
};

