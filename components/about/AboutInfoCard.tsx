import * as React from 'react';
// next imports //
import NextImage from "next/image";
// styles //
import styles from "@/styles/about/AboutInfoCard.module.css";

interface IAboutInfoCardProps {
}

export const AboutInfoCard: React.FunctionComponent<IAboutInfoCardProps> = (props): JSX.Element => {
  return (
    <div className={ styles.aboutInfoCardContainer }>
      <div className={ styles.avatarContainer }>
        <div className={ styles.avatarPicWrapper }>
          <NextImage src="/images/defaults/programming_stock_4.jpg" layout="fill" />
        </div>
      </div>
      <div className={ styles.infoWrapper }>
        <h3>Name Lastname</h3>
        <span>handle@handle.com</span>
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.</p>
      </div>
    </div>
  );
};

