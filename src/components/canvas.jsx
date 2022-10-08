import { useEffect, useRef, useState } from "react";

const WIDTH = 1500;
const HEIGHT = 500;

const rectWidth = 12;
const rectHeight = 12;

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2;
const SCROLL_SENSITIVITY = 0.01;
let zoom = 1;
let zoomingTimer;

let isDragging = false;
let canvasX;
let canvasY;

export const Canvas = ({ coordinates, handleCellClick, closeColorPicker }) => {
  const [allowClick, setAllowClick] = useState(false);
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = redraw();
    const canvasContainer = canvasContainerRef.current;

    canvas.addEventListener('mousedown', start_drag);
    canvasContainer.addEventListener('mousemove', while_drag);
    canvasContainer.addEventListener('mouseup', stop_drag);
    canvasContainer.addEventListener('wheel', zoomFunc);
  }, []);

  useEffect(() => {
    redraw();
  }, [coordinates]);

  const zoomFunc = (e) => {
    clearTimeout(zoomingTimer);

    zoomingTimer = setTimeout(() => {
      redraw();
    }, 200);

    if (event.deltaY > 0) {
      zoom += SCROLL_SENSITIVITY;

      if (zoom > MAX_ZOOM) {
        zoom = MAX_ZOOM;
      }

      canvasRef.current.style.transform = `scale(${zoom})`;
    }
    else if (event.deltaY < 0) {
      zoom -= SCROLL_SENSITIVITY;

      if (zoom < MIN_ZOOM) {
        zoom = MIN_ZOOM;
      }

      canvasRef.current.style.transform = `scale(${zoom})`;
    }
  }

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, WIDTH * zoom, HEIGHT * zoom);
    coordinates.forEach((coordinate, i) => {
      ctx.fillStyle = coordinate.color;
      ctx.lineWidth = 0.2;
      // ctx.strokeRect(coordinate.x, coordinate.y, rectWidth * zoom, rectHeight * zoom);
      ctx.fillRect(coordinate.x, coordinate.y, rectWidth * zoom, rectHeight * zoom);
    });

    return canvas;
  }

  function start_drag() {
    closeColorPicker();
    isDragging = true;
    canvasRef.current = this;
    canvasX = window.event.clientX - canvasRef.current.offsetLeft;
    canvasY = window.event.clientY - canvasRef.current.offsetTop;
  }

  const stop_drag = () => {
    isDragging = false;
  }

  const while_drag = () => {
    if (isDragging) {
      setAllowClick(false);
      let x_cursor = window.event.clientX;
      let y_cursor = window.event.clientY;
      if (canvasRef.current !== null) {
        canvasRef.current.style.left = (x_cursor - canvasX) + 'px';
        canvasRef.current.style.top = (y_cursor - canvasY) + 'px';
      }
    } else {
      if (!allowClick) {
        setAllowClick(true);
      }
    }
  }

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const collision = collides(Array.from(coordinates.values()), x, y, rectWidth, rectHeight);
    if (collision) {
      handleCellClick(collision, e)
    }
  }

  return (
    <div id="canvas" ref={canvasContainerRef}>
      <canvas id="canvas-el" width={WIDTH} height={HEIGHT} ref={canvasRef} onClick={allowClick ? handleClick : null} />
    </div>
  )
}

const collides = (rects, x, y, rectWidth, rectHeight) => {
  var isCollision = false;
  for (let i = 0, len = rects.length; i < len; i++) {
    const left = rects[i].x * zoom
    const right = rects[i].x * zoom + rectWidth * zoom;
    const top = rects[i].y * zoom;
    const bottom = rects[i].y * zoom + rectHeight * zoom;

    if (right >= x
      && left <= x
      && bottom >= y
      && top <= y) {
      isCollision = rects[i];
    }
  }

  return isCollision;
}