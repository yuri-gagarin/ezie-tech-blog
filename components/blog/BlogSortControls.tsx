import * as React from 'react';
import { Dropdown, DropdownItemProps, Icon, Menu } from "semantic-ui-react";
// 
//import axiosInstance from "../axios/axiosInstance";
//import { AxiosRequestConfig } from "axios";
import type { SearchCategories } from "../../redux/_types/blog_posts/dataTypes";
import styles from "../../styles/blog/BlogSortControls.module.css";

interface IBlogSortControlsProps {
  handleBlogPostSort({ category, date, popularity }: { category?: SearchCategories; date?: "asc" | "desc"; popularity?: string }): Promise<any>;
}

type DropDownValue = "New" | "Old" | "Most Read";
type CategoriesValue = "All" | "Informational" | "Begginner" | "Intermediate" | "Advanced";
type LocalState = {
  dropdownValue: DropDownValue;
  categoriesValue: CategoriesValue;
}

export const BlogSortControls: React.FunctionComponent<IBlogSortControlsProps> = ({ handleBlogPostSort }): JSX.Element => {
  const [ localState, setLocalState ] = React.useState<LocalState>({ dropdownValue: "New", categoriesValue: "All" });

  const handlePostSortClick = async (_, data: DropdownItemProps): Promise<void> => {
    const value = data.value as DropDownValue;
    try {
      if (value === "New" || value === "Old") {
        const date = value === "New" ? "desc" : "asc";
        await handleBlogPostSort({ date });
      } else {
        await handleBlogPostSort({ popularity: value.toLocaleLowerCase() });
      }
      return setLocalState({ ...localState, dropdownValue: value });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostCategorySortClick = async (_, data: DropdownItemProps): Promise<void> => {
    const categoryVal = data.value as CategoriesValue;
    try {
      await handleBlogPostSort({ category: categoryVal.toLowerCase() as SearchCategories });
      setLocalState({ ...localState, categoriesValue: categoryVal });
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <Menu fluid> 
      <Dropdown icon="clock" pointing text={`Sort by: ${localState.dropdownValue}`} className={ styles.dropdownMenu }>
        <Dropdown.Menu className={ styles.timeSortMenu }>
          <Dropdown.Item value="New" onClick={ handlePostSortClick }>
            Newest first..
          </Dropdown.Item>
          <Dropdown.Item value="Old" onClick={ handlePostSortClick }>
            Oldest first...
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown pointing text={`Category: ${localState.categoriesValue}`} className={ styles.dropdownMenu }>
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
          <Dropdown.Item value="Advanced" onClick={ handlePostCategorySortClick }>
            Expert Posts
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu>
  );
};

