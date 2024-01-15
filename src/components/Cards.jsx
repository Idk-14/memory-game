import React, { useEffect, useRef, useState } from "react";
import { getImages } from "../../helpers/getImages";

let size = 3;
let clicks = 0;

const Cards = ({ start, timerReset }) => {
    const [images, setImages] = useState(getImages(size));
    const [selected, setSelected] = useState([]);
    const [opened, setOpened] = useState([]);
    const score = useRef(0);
    const [reset, setReset] = useState(false);
  
    const handleClick = (item) => {
      if (start && selected.length < 2) {
        setSelected((selected) => selected.concat(item));
      }
    };
  
    useEffect(() => {
      if (selected.length === 2) {
        if (selected[0].split("|")[1] === selected[1].split("|")[1]) {
          setOpened((opened) => opened.concat(selected));
        }
        setTimeout(() => {
          setSelected([]);
        }, 500);
      }
    }, [selected]);
  
    useEffect(() => {
      if (opened.length === images.length) {
        calculateScore();
        size = size + 2;
        clearArrays();
        setImages(getImages(size));
      }
    }, [opened]);
  
    useEffect(() => {
      if (timerReset) {
        setReset((prevReset) => !prevReset);
        clearArrays(); // Reiniciar las cartas cuando se reinicie el temporizador
      }
    }, [timerReset]);
  
    useEffect(() => {
      if (start) {
        // Reiniciar completamente las cartas cuando se presiona el botón de inicio
        size = 3;
        clicks = 0;
        score.current = 0;
        clearArrays();
        setImages(getImages(size));
      }
    }, [start]);
  
    const clearArrays = () => {
      setSelected([]);
      setOpened([]);
    };

  const calculateScore = () => {
    const passLevel = size * 10;
    let total = score.current;
    const cards = size * 2;
    if (clicks === cards) {
      total = total + cards * 2 + passLevel;
    } else if (clicks > cards && clicks < cards + 5) {
      total = total + cards + passLevel;
    } else if (clicks > cards + 5 && clicks < cards + 10) {
      total = total + cards / 2 + passLevel;
    } else {
      total = total + Math.round(cards / 3) + passLevel;
    }
    clicks = 0;
    score.current = total;
  };

  let include = false;

  return (
    <div className="cards">
      <h2>Score: {score.current}</h2>
      <ul>
        {images.map((item, index) => (
          <li key={index} onClick={() => handleClick(item)}>
            <div className="content">
              {include = selected.includes(item) || opened.includes(item)}

              <div className={`front ${include ? "flip-front" : ""}`}>
                <img src="/question.png" alt="icon" />
              </div>
              <div className={`back ${include ? "flip-back" : ""}`}>
                <img src={item.split("|")[1]} alt="icon" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cards;
