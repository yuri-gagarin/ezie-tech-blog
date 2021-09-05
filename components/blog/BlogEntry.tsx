import React from "react";
import { Button, Card, Grid, Image } from "semantic-ui-react";
// axios //
import axiosInstance from "../axios/axiosInstance";
import type { AxiosRequestConfig} from "axios";
// styles //
import blogEntryStyle from "../../styles/blog/BlogEntry.module.css";
// helpers //
import { useWindowSize } from "../_helpers/monitorWindowSize";
export const BlogEntry: React.FC<{}> = (): JSX.Element => {

  const { width } = useWindowSize();

  const handleBtnClick = (): void => {
    const opts: AxiosRequestConfig = {
      url: "/api/test",
      method: "GET"
    }
    axiosInstance(opts).then(res => console.log(res)).catch(err => console.log(err));
  };

  return (
    <Grid.Column className={ blogEntryStyle.blogEntryColumn } largeScreen={ 12 } tablet= { 16 } mobile= { 16 }>
      <Card.Group className={ blogEntryStyle.cardGroup } centered={ width <  600 ? true : false }>
        <Card raised fluid={ width > 600 ? true : false }>
          <Image src="/images/blog1.jpg" size="large" alt="image" />
          <Card.Content>
            <Card.Header>Title here</Card.Header>
            <Card.Meta>Posted at: 2021</Card.Meta>
            <Card.Description>A description goes here</Card.Description>
          </Card.Content>
          <Card.Content>
              <Button onClick={ handleBtnClick } content="Read..." />
            </Card.Content>
        </Card>
        <Card raised>
          <Image src="/images/blog1.jpg" alt="image" />
          <Card.Content>
            <Card.Header>Title here</Card.Header>
            <Card.Meta>Posted at: 2021</Card.Meta>
            <Card.Description>A description goes here</Card.Description>
          </Card.Content>
        </Card>
        <Card raised>
          <Image src="/images/blog1.jpg" alt="image" />
          <Card.Content>
            <Card.Header>Title here</Card.Header>
            <Card.Meta>Posted at: 2021</Card.Meta>
            <Card.Description>A description goes here</Card.Description>
          </Card.Content>
        </Card>
        <Card raised>
          <Image src="/images/blog1.jpg" alt="image" />
          <Card.Content>
            <Card.Header>Title here</Card.Header>
            <Card.Meta>Posted at: 2021</Card.Meta>
            <Card.Description>A description goes here</Card.Description>
          </Card.Content>
        </Card>
      </Card.Group>
    </Grid.Column>
  );
};