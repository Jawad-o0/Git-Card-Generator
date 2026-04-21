import React, { useState, useEffect } from 'react';

const DecryptText = ({ text = "" }) => {
  const [display, setDisplay] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    let frame = 0;
    let revealed = 0;
    const maxFramesPerChar = 3;
    const total = text.length;

    const interval = setInterval(() => {
      frame++;
      if (revealed < total) {
        if (frame % maxFramesPerChar === 0) revealed++;
        let out = "";
        for (let i = 0; i < total; i++) {
          out += i < revealed ? text[i] : chars[Math.floor(Math.random() * chars.length)];
        }
        setDisplay(out);
      } else {
        setDisplay(text);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="inline-block align-baseline font-black tracking-tight">
      {display}
    </span>
  );
};

export default DecryptText;
