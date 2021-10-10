import * as React from 'react';
// styles //
import styles from "@/styles/animated/AnimatedCyberBtn.module.css";

interface IAdnimatedButtonProps {
  content: string;
  clip: "clipLeftBottom" | "clipLeftTop" | "clipRightBotton" | "clipRightTop" | "clipAll" | "clipNone";
  color: "violet";
  pauseInterval?: number;
  hovered?: boolean;
  onClick?(e: React.MouseEvent<HTMLButtonElement>): void;
}

export const AnimatedCyberButton: React.FunctionComponent<IAdnimatedButtonProps> = ({ content, clip, color, pauseInterval, hovered, onClick }): JSX.Element => {
  // local state //
  const [ animationInterval, setAnimationInterval ] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timer;
    if (pauseInterval) {
      interval = setInterval(() => {
        setAnimationInterval((interval) => !interval);
      }, pauseInterval)
    }
    return () => {
      clearInterval(interval);
    }
  }, [ pauseInterval ]);


  return (
    <button className={ `${styles.animatedCyberBtn} ${styles[clip]} ${styles[color]} ${(hovered ? styles.hovered : "")}`} onClick= { onClick } >
      { content }<span aria-hidden={ true }>_</span>
      <span className={ `${styles.cyberBtnGlitch} ${ animationInterval ? styles.intervaled : ""}` } aria-hidden={ true }>${content}_</span>
    </button>
  );
};

