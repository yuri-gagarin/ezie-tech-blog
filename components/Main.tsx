import { Grid } from "semantic-ui-react";
import mainStyles from "../styles/MainStyle.module.css";

export const MainComponent = ({ children }): JSX.Element => {

  return (
    <Grid className={ mainStyles.mainGrid }>
      { children }
    </Grid>
  )
}