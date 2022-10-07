import { useState } from "react";

export const Cell = ({ coordinate, onClick, width, height, isSelected, allowSelection }) => {
  return (
    <rect
      onClick={allowSelection ? () => onClick(coordinate.id) : null}
      className="cell"
      style={{
        x: coordinate.x,
        y: coordinate.y,
        fill: coordinate.color,
        stroke: isSelected && 'black',
        strokeWidth: isSelected && 1,
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
    </rect>
  )
}