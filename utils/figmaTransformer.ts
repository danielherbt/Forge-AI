import { CanvasElement, ShapeType } from '../components/CanvasEditor';
import { FigmaNode, FigmaColor } from '../types/figma';

function figmaColorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getFillColor(node: FigmaNode): string {
  const solidFill = node.fills?.find(f => f.type === 'SOLID' && f.visible !== false);
  return solidFill ? figmaColorToHex(solidFill.color) : '#CCCCCC';
}

function transformNode(node: FigmaNode, parentGroupId?: string): CanvasElement | null {
  let shapeType: ShapeType | null = null;
  
  switch (node.type) {
    case 'RECTANGLE':
      shapeType = 'rect';
      break;
    case 'ELLIPSE':
      shapeType = 'circle';
      break;
    case 'TEXT':
      shapeType = 'text';
      break;
    default:
      return null;
  }

  if (!node.absoluteBoundingBox) return null;

  const { x, y, width, height } = node.absoluteBoundingBox;

  const element: CanvasElement = {
    id: window.uuidv4(),
    type: shapeType,
    x: x,
    y: y,
    width: width,
    height: height,
    rotation: node.rotation || 0,
    fill: getFillColor(node),
    groupId: parentGroupId,
    cornerRadius: node.cornerRadius,
    text: node.characters,
    fontSize: node.style?.fontSize,
  };
  
  return element;
}

export function transformFigmaNodes(nodes: FigmaNode[]): CanvasElement[] {
  const canvasElements: CanvasElement[] = [];

  function traverse(node: FigmaNode, groupId?: string) {
    let currentGroupId = groupId;
    
    if (node.type === 'GROUP' || node.type === 'FRAME') {
      currentGroupId = window.uuidv4();
    }

    const element = transformNode(node, currentGroupId);
    if (element) {
      canvasElements.push(element);
    }
    
    if (node.children && ('children' in node)) {
      [...node.children].forEach(child => traverse(child, currentGroupId));
    }
  }

  nodes.forEach(node => traverse(node));
  
  if (canvasElements.length === 0) return [];
  
  const minX = Math.min(...canvasElements.map(el => el.x));
  const minY = Math.min(...canvasElements.map(el => el.y));

  const CANVAS_PADDING = 50;
  return canvasElements.map(el => ({
    ...el,
    x: el.x - minX + CANVAS_PADDING,
    y: el.y - minY + CANVAS_PADDING,
  }));
}