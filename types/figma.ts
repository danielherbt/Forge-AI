export interface FigmaFile {
  document: FigmaNode;
  components: { [key: string]: any };
}

export type NodeType = 'DOCUMENT' | 'CANVAS' | 'FRAME' | 'GROUP' | 'RECTANGLE' | 'ELLIPSE' | 'TEXT' | 'VECTOR' | 'LINE';

export interface FigmaNode {
  id: string;
  name: string;
  type: NodeType;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  strokeWeight?: number;
  rotation?: number;
  cornerRadius?: number;
  characters?: string;
  style?: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    textAlignHorizontal?: string;
    textAlignVertical?: string;
    letterSpacing?: number;
    lineHeightPx?: number;
  };
}

export interface FigmaPaint {
  type: 'SOLID';
  color: FigmaColor;
  visible?: boolean;
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}
