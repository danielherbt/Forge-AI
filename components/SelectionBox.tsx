import React from 'react';
import { CanvasElement } from './CanvasEditor';

interface SelectionBoxProps {
  element: CanvasElement;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
  onRotateStart: (e: React.MouseEvent) => void;
  scale: number;
}

const HANDLE_SIZE = 8;
const ROTATION_HANDLE_OFFSET = 25;

const SelectionBox: React.FC<SelectionBoxProps> = ({ element, onResizeStart, onRotateStart, scale }) => {
  if (!element) return null;

  const { x, y, width, height, rotation } = element;

  const transform = `translate(${x} ${y}) rotate(${rotation} ${width / 2} ${height / 2})`;

  const scaledHandleSize = HANDLE_SIZE / scale;
  const scaledStrokeWidth = 2 / scale;
  const scaledRotationOffset = ROTATION_HANDLE_OFFSET / scale;


  const handles = [
    { name: 'tl', x: 0, y: 0, cursor: 'nwse-resize' },
    { name: 'tm', x: width / 2, y: 0, cursor: 'ns-resize' },
    { name: 'tr', x: width, y: 0, cursor: 'nesw-resize' },
    { name: 'ml', x: 0, y: height / 2, cursor: 'ew-resize' },
    { name: 'mr', x: width, y: height / 2, cursor: 'ew-resize' },
    { name: 'bl', x: 0, y: height, cursor: 'nesw-resize' },
    { name: 'bm', x: width / 2, y: height, cursor: 'ns-resize' },
    { name: 'br', x: width, y: height, cursor: 'nwse-resize' },
  ];

  return (
    <g transform={transform}>
      {/* Bounding box */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        stroke="rgb(56, 189, 248)"
        strokeWidth={scaledStrokeWidth}
        vectorEffect="non-scaling-stroke"
        style={{ pointerEvents: 'none' }}
      />

      {/* Resize handles */}
      {handles.map(h => (
        <rect
          key={h.name}
          x={h.x - scaledHandleSize / 2}
          y={h.y - scaledHandleSize / 2}
          width={scaledHandleSize}
          height={scaledHandleSize}
          fill="white"
          stroke="rgb(56, 189, 248)"
          strokeWidth={scaledStrokeWidth / 2}
          vectorEffect="non-scaling-stroke"
          style={{ cursor: h.cursor }}
          onMouseDown={e => onResizeStart(e, h.name)}
        />
      ))}
      
      {/* Rotation handle */}
      <g onMouseDown={onRotateStart} style={{ cursor: 'crosshair' }}>
        <line
          x1={width / 2}
          y1={0}
          x2={width / 2}
          y2={-scaledRotationOffset}
          stroke="rgb(56, 189, 248)"
          strokeWidth={scaledStrokeWidth}
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={width / 2}
          cy={-scaledRotationOffset}
          r={scaledHandleSize / 1.5}
          fill="white"
          stroke="rgb(56, 189, 248)"
          strokeWidth={scaledStrokeWidth / 2}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </g>
  );
};

export default SelectionBox;