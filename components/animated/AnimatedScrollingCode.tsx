import * as React from 'react';
import { randomIntFromInterval } from '../_helpers/generalHelpers';

interface IAdnimatedScrollingCodeProps {
}

export const AnimatedScrollingCode: React.FunctionComponent<IAdnimatedScrollingCodeProps> = ({ children }): JSX.Element => {
  const contextRef = React.useRef<HTMLCanvasElement | null>(null);


  const createCanvas = (canvas: HTMLCanvasElement): NodeJS.Timer => {
    // 
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    //
    const font_size = 10;
    const fontColors: string[] = ["#f4427d", "#a832a4", "#1c9c25", "#014a06", "#2926ed", "#c9bc04"];
    const columns: number = canvas.width/font_size; //number of columns for the rain
    // 
    const ctx = canvas.getContext("2d");
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const charsArr: string[] = chars.split("");

    //an array of drops - one per column
    const drops: number[] = [];
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for(let x = 0; x < columns; x++) {
        drops[x] = 1; 
    }

    function draw() {
      //Black BG for the canvas
      //translucent BG to show trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = font_size + "px arial";
      //looping over drops
      for(let i = 0; i < drops.length; i++) {
        //a random chinese character to print
        const text = charsArr[Math.floor(Math.random()  * charsArr.length) ];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillStyle = fontColors[randomIntFromInterval(0, 5)];
        ctx.fillText(text, i*font_size, drops[i]*font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if(drops[i]*font_size > canvas.height && Math.random() > 0.975) drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
      }
    }

    return setInterval(draw, 35);
  }

  React.useEffect(() => {
    let interval: NodeJS.Timer;
    if (contextRef.current) {
      interval = createCanvas(contextRef.current);
    }
    return () => {
      clearInterval(interval);
    }
  }, [ contextRef ])

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", border: "5px solid green", background: 'url("/backgrounds/header_bg1.jpg")' }}>
      <canvas ref={ contextRef }>
        { children }
      </canvas>
    </div> 
  );
};

