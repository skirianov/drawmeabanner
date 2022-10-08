import { useEffect, useRef, useState } from "react";
import svgPanZoom from "svg-pan-zoom";
import { ColorPicker } from "./color-picker";
import { Cell } from "./cell";
import { InfoBox } from "./info-box";
import { Canvas } from "./canvas";

const BASIC_URL = 'http://localhost:3000';

export const MAX_PAINTS = 3;

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

  const colorPickerRef = useRef(null);
  const paintsRef = useRef(null);

  useEffect(() => {
    const newCoordinates = new Map();
    // setIsLoading(true);
    try {
      getAllSquares().then((squares) => {
        squares.forEach((coordinate) => {
          newCoordinates.set(coordinate.id, coordinate);
        });
        // setIsLoading(false);
        setCoordinates(newCoordinates);

        console.log(newCoordinates)
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
      setCanvasClass('disabled');
      return;
    } else {
      setCanvasClass('');
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

  const handlePaintSubmit = () => {
    if (paints > 0) {
      setPaints(paints - 1);
      closeColorPicker();
    }

    const copiedCoordinates = new Map(coordinates);

    copiedCoordinates.set(selectedCell.id, { ...selectedCell, status: 'unpainted', color: color, old_color: color, owner: name });

    setCoordinates(copiedCoordinates);
    setSelectedCell(null);
  }

  return (
    <div className="container">
      {isLoading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <>
        <div className="board">
          {coordinates && <Canvas coordinates={coordinates} handleCellClick={handleCellClick} closeColorPicker={closeColorPicker} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />}
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
      </>
      )}
    </div>
  )
}