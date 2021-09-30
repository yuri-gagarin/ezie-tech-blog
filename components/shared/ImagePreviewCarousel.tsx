import * as React from 'react';
import { Icon } from "semantic-ui-react";
// next imports //
import NextImage from "next/image";
// styles //
import styles from "@/styles/shared/ImagePreviewCarousel.module.css";

interface ImagePreviewCarouselProps {
  imageURLs: string[];
  handleDeleteProjectImage(imageURL: string): Promise<any>;
}

export const ImagePreviewCarousel: React.FunctionComponent<ImagePreviewCarouselProps> = ({ imageURLs, handleDeleteProjectImage }): JSX.Element => {
  return (
    <div className={ styles.carouselWrapper }>
      {
        imageURLs.map((url, i) => {
          return (
            <div key={`${url}_${i}`} className={ styles.imageWrapper }>
              <NextImage src={"https://picsum.photos/200/300"} layout="fill" objectFit="contain" onClick={ () => console.log("clicked image")} />
              <Icon size="large" className={ styles.deleteIcon } name="trash" color="red" onClick={ () => handleDeleteProjectImage(url) } />
            </div>
          )
        })
      }
    </div>
  );
};

