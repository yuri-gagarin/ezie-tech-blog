import * as React from 'react';
// next imports //
import NextImage from "next/image";
// styles //
import styles from "@/styles/shared/ImagePreviewCarousel.module.css";

interface ImagePreviewCarouselProps {
  imageURLs: string[];
}

export const ImagePreviewCarousel: React.FunctionComponent<ImagePreviewCarouselProps> = ({ imageURLs }): JSX.Element => {
  return (
    <div className={ styles.carouselWrapper }>
      <div className={ styles.imageWrapper }>
        <NextImage src={"https://picsum.photos/200/300"} layout="fill" objectFit="contain" />
      </div>
      <div className={ styles.imageWrapper }>
        <NextImage src={"https://picsum.photos/200/300"} layout="fill" objectFit="contain" />
      </div>
      <div className={ styles.imageWrapper }>
        <NextImage src={"https://picsum.photos/200/300"} layout="fill" objectFit="contain" />
      </div>
      <div className={ styles.imageWrapper }>
        <NextImage src={"https://picsum.photos/200/300"} layout="fill" objectFit="contain" />
      </div>
      <div className={ styles.imageWrapper }>
        <NextImage src={"https://picsum.photos/200/300"} layout="fill" objectFit="contain" />
      </div>
      <div className={ styles.imageWrapper }>
        <NextImage src={"https://picsum.photos/200/300"} layout="fill" objectFit="contain" />
      </div>
    </div>
  );
};

