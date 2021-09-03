import React from "react";
import { Card, Grid, Image, Segment } from "semantic-ui-react";
// styles //
import blogViewStyle from "../../styles/blog/BlogView.module.css";

export const BlogView: React.FC<{}> = (): JSX.Element => {

  const { width } = useWindowSize();

  return (
    width > 1200 ?
      <Grid.Column largeScreen={4} tablet={8} mobile={16} className={ blogViewStyle.gridColumn }>
        <Card.Group className={ blogViewStyle.cardGroup } centered >
          <Card>
            <Image src="/images/blog1.jpg" size="small" />
            <Card.Content>
              <Card.Header>Title here</Card.Header>
              <Card.Meta>Posted at: 2021</Card.Meta>
              <Card.Description>A description goes here</Card.Description>
            </Card.Content>
          </Card>
          <Card>
            <Image src="/images/blog1.jpg" size="small"  />
            <Card.Content>
              <Card.Header>Title here</Card.Header>
              <Card.Meta>Posted at: 2021</Card.Meta>
              <Card.Description>A description goes here</Card.Description>
            </Card.Content>
          </Card>
          <Card>
            <Image src="/images/blog1.jpg" size="small"  />
            <Card.Content>
              <Card.Header>Title here</Card.Header>
              <Card.Meta>Posted at: 2021</Card.Meta>
              <Card.Description>A description goes here</Card.Description>
            </Card.Content>
          </Card>
          <Card>
            <Image src="/images/blog1.jpg" size="small"  />
            <Card.Content>
              <Card.Header>Title here</Card.Header>
              <Card.Meta>Posted at: 2021</Card.Meta>
              <Card.Description>A description goes here</Card.Description>
            </Card.Content>
          </Card>
        </Card.Group>
      </Grid.Column>
    :
    <></>
  );
};


// remote to helpers //
function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  function handleResize() {
    // Set window width/height to state
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);     
      handleResize();
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []); 
  return windowSize;
}