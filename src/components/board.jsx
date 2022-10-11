import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import svgPanZoom from "svg-pan-zoom";
import { FaInfoCircle } from "react-icons/fa";

import { ColorPicker } from "./color-picker";
import { Cell } from "./cell";
import { InfoBox } from "./info-box";
import { Canvas } from "./canvas";
import { convertArrayToMap } from "../utils/coordinates";
import { About } from "./about";

const BASIC_URL = 'https://www.drawmeabanner.lol';
const WS_URL = 'ws://www.drawmeabanner.lol';

export const MAX_PAINTS = 5;

export const Board = ({ name }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [color, setColor] = useState("#fff");
  const [selectedCell, setSelectedCell] = useState(null);
  const [allowSelection, setAllowSelection] = useState(false);
  const [canvasClass, setCanvasClass] = useState("");
  const [paints, setPaints] = useState(MAX_PAINTS);
  const [isShowingPicker, setIsShowingPicker] = useState(false);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);
  const [stupidUserCounter, setStupidUserCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [showAbout, setShowAbout] = useState(false);
  const [webSocketData, setWebSocketData] = useState(null);

  const colorPickerRef = useRef(null);
  const paintsRef = useRef(null);

  useEffect(() => {
    const newCoordinates = new Map();
    try {
      getAllSquares().then((squares) => {
        const newCoordinatesMap = convertArrayToMap(squares);

        setCoordinates(newCoordinatesMap);
      });

    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }, []);

  const getAllSquares = async () => {
    const res = await fetch(`${BASIC_URL}/squares`);
    const squares = await res.json();

    return squares;
  }

  const submitCell = async (id, cell) => {
    const res = await fetch(`${BASIC_URL}/squares/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cell),
    });
    const data = await res.json();

    return data;
  }

  const closeColorPicker = () => {
    colorPickerRef.current.style = 'visibility: hidden;';

    if (!selectedCell) return;

    const copiedCoordinates = new Map(coordinates);

    if (selectedCell.status === 'unpainted') {
      copiedCoordinates.set(selectedCell.id, { ...selectedCell, color: selectedCell.old_color });
    } else {
      copiedCoordinates.set(selectedCell.id, { ...selectedCell, color: color, status: 'to_submit' });
    }

    setCoordinates(copiedCoordinates);
    setSelectedCell(null);
  }

  const onColorPickComplete = (color) => {
    setColor(color);

    if (color) {
      const copiedCoordinates = new Map(coordinates);

      copiedCoordinates.set(selectedCell.id, { ...selectedCell, color: color, status: 'to_submit' });

      setCoordinates(copiedCoordinates);
    }
  }

  const handleCellClick = (cell, event) => {
    if (selectedCell) {
      closeColorPicker();
    }

    if (stupidUserCounter === 3) {
      paintsRef.current.className = 'paints--warning';
    }

    if (stupidUserCounter === 6) {
      paintsRef.current.textContent = 'No, really! STOP IT!';
    }

    if (stupidUserCounter === 9) {
      paintsRef.current.textContent = 'I\'m not kidding!';
    }

    if (stupidUserCounter === 12) {
      paintsRef.current.textContent = 'I\'ll refresh your browser now!!!';
      paintsRef.current.style.fontSize = '60px'
    }

    if (stupidUserCounter === 15) {
      const warning = document.createElement('div');
      warning.textContent = 'I warned you!';
      warning.style.width = '100%';
      warning.style.fontSize = '160px';
      warning.style.color = 'red';
      warning.style.position = 'absolute';
      warning.style.top = '50%';
      warning.style.left = '50%';
      warning.style.transform = 'translate(-25%, -50%)';

      const app = document.querySelector('.App');
      app.style.filter = 'blur(10px) contrast(0.2)';
      document.body.appendChild(warning);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    if (paints === 0) {
      setStupidUserCounter(stupidUserCounter + 1);
      return;
    }

    cell.color = color;

    setSelectedCell(cell);
    let top = event.clientY - 50;
    let left = event.clientX + 50;

    if (top < 50) {
      top = 50;
    } else if (top > window.innerHeight - 500) {
      top = window.innerHeight - 500;
    }

    if (left > window.innerWidth - 400) {
      left = left - 400;
    }

    colorPickerRef.current.style = `display: flex; visibility: visible; top: ${top}px; left: ${left}px;`;
  }

  const handlePaintSubmit = async () => {
    if (paints > 0) {
      setPaints(paints - 1);
      closeColorPicker();
    }

    const copiedCoordinates = new Map(coordinates);
    const updatedCell = { ...selectedCell, status: 'unpainted', color: color, old_color: color, owner: name }

    copiedCoordinates.set(selectedCell.id, updatedCell);

    setCoordinates(copiedCoordinates);
    setSelectedCell(null);

    await submitCell(selectedCell.id, updatedCell)
  }

  const { lastMessage, } = useWebSocket(WS_URL, {
    onOpen: () => console.log('opened'),
    onMessage: (message) => {
      const parsedMessage = JSON.parse(message.data);

      const newCoordinatesMap = convertArrayToMap(parsedMessage);

      setWebSocketData(newCoordinatesMap);

      if (messageHistory.length % 10 === 0) {
        setCoordinates(newCoordinatesMap);
      }
    },
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  return (
    <div className="container">
      <div className="greeting">
        <p>Draw my Twitter banner</p>
        <div className="info-icon" onClick={() => setShowAbout(!showAbout)}>
          <FaInfoCircle />
        </div>
      </div>
      <div className="board">
        {coordinates && <Canvas coordinates={coordinates} handleCellClick={handleCellClick} closeColorPicker={closeColorPicker} canvasClass={canvasClass} />}
      </div>
      <ColorPicker
        selectedCell={selectedCell}
        color={color}
        setColor={setColor}
        onChangeComplete={onColorPickComplete}
        colorPickerRef={colorPickerRef}
        closeColorPicker={closeColorPicker}
        handlePaintSubmit={handlePaintSubmit}
      />
      <InfoBox paints={paints} setPaints={setPaints} setCanvasClass={setCanvasClass} paintsRef={paintsRef} setStupidUserCounter={setStupidUserCounter} />
      <About showAbout={showAbout} setShowAbout={setShowAbout} />
    </div>
  )
}

// running well
// const startPerformanceTest = () => {
//   let timer = 0;

//   setInterval(() => {
//     const ids = ['0,0', '0,12', '0,24', '0, 36', 
//       '12,0', '12,12', '12,24', '12,36',
//       '24,0', '24,12', '24,24', '24,36',
//       '36,0', '36,12', '36,24', '36,36'];

//     const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

//     const randomId = ids[Math.floor(Math.random() * ids.length)];

//     fetch(`${BASIC_URL}/squares/${randomId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         },
//       body: JSON.stringify({
//         ...coordinates.get(randomId),
//         color: colors[Math.floor(Math.random() * colors.length)],
//       }),
//     });

//     timer += 1;
//   }, 100);

//   if (timer === 100) {
//     clearInterval();
//   }
// }