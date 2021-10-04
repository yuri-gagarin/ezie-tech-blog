import * as React from 'react';
import { Dropdown, Icon, Menu } from "semantic-ui-react";
// types //
import type { DropdownItemProps } from "semantic-ui-react";
import type { RSSSources } from "@/redux/_types/rss/dataTypes";
// styles //
import styles from "@/styles/news/NewsControls.module.css";

interface INewsControlsProps {
  source: RSSSources | "";
  handleRSSSourceSelect(e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: DropdownItemProps): Promise<any>;
}

export const NewsControls: React.FunctionComponent<INewsControlsProps> = ({ source, handleRSSSourceSelect }): JSX.Element => {
  return (
    <Menu fluid>
      <Dropdown text="Source: Reddit" pointing className={ `link item ${styles.newsControlsDropdown}` }>
        <Dropdown.Menu>
          <Dropdown.Header>News From:</Dropdown.Header>
          <Dropdown.Item value="reddit" onClick={ handleRSSSourceSelect }>
            <Icon name="reddit"/>
            Reddit
          </Dropdown.Item>
          <Dropdown.Item value="medium" onClick={ handleRSSSourceSelect }>
            <Icon name="medium"/>
            Medium
          </Dropdown.Item>
          <Dropdown.Item value="cnet" onClick={ handleRSSSourceSelect }>
            <Icon name="coffee" />
            CNet
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item value="all" onClick={ handleRSSSourceSelect }>
            <Icon name="book" />
            All
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown text="Order: Newest" pointing className={ `link item ${styles.newsControlsDropdown}` }>
        <Dropdown.Menu>
          <Dropdown.Header>Sort By:</Dropdown.Header>
          <Dropdown.Item>
            <Icon name="arrow up"/>
            Newest
          </Dropdown.Item>
          <Dropdown.Item>
            <Icon name="arrow down"/>
            Oldest
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <Icon name="hotjar" />
            Hot
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu>
  );
};