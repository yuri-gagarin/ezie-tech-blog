import * as React from 'react';
import { Button } from 'semantic-ui-react';
// next imports //
import NextImage from "next/image";
// styles //
import styles from "@/styles/about/AboutInfoCard.module.css";

interface IAboutInfoCardProps {
  handleOpenContactForm: React.MouseEventHandler<HTMLButtonElement>;
  handleToggleFollow(): void;
}

export const AboutInfoCard: React.FunctionComponent<IAboutInfoCardProps> = ({ handleOpenContactForm, handleToggleFollow }): JSX.Element => {
  return (
    <div className={ styles.aboutInfoCardContainer }>
      <div className={ styles.avatarContainer }>
        <div className={ styles.avatarPicWrapper }>
          <NextImage src="/images/defaults/programming_stock_4.jpg" layout="fill" objectFit="cover" />
        </div>
      </div>
      <div className={ styles.infoWrapper }>
        <h3>Name Lastname</h3>
        <span>handle@handle.com</span>
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.</p>
      </div>
      <div className={ styles.infoControls }>
        <Button.Group>
          <Button size="small" color="violet" content="Contact" icon="mail" onClick={ handleOpenContactForm } data-email={ "mail@mail.com" } />
          <Button inverted  size="small"  color="purple" content="Follow" icon="add square" onClick={ handleToggleFollow } />
        </Button.Group>
      </div>
    </div>
  );
};

