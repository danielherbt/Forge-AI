import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RectangleIcon, CircleIcon, TextIcon, PRE_BUILT_COMPONENTS, UndoIcon, RedoIcon, FigmaImportIcon, ExportIcon } from '../constants';
import PropertiesPanel from './PropertiesPanel';
import SelectionBox from './SelectionBox';
import FigmaImportModal from './FigmaImportModal';
import ExportCodeModal from './ExportCodeModal';
import { transformFigmaNodes } from '../utils/figmaTransformer';
import { FigmaFile } from '../types/figma';
import { ComponentStates } from '../types/states';
import StatesPanel from './StatesPanel';

export type ShapeType = 'rect' | 'circle' | 'text';

export type CanvasElement = {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text?: string;
  fill: string;
  groupId?: string;
  fontSize?: number;
  cornerRadius?: number;
};

type InteractionState =
  | { type: 'moving'; startElements: CanvasElement[]; startX: number; startY: number; }
  | { type: 'resizing'; startElement: CanvasElement; handle: string; startX: number; startY: number; }
  | { type: 'rotating'; startElement: CanvasElement; startAngle: number; centerX: number; centerY: number; }
  | null;

interface CanvasEditorProps {
  elements: CanvasElement[];
  setElements: (updater: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[]), override?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  componentStates: ComponentStates;
  setComponentStates: (updater: ComponentStates | ((prev: ComponentStates) => ComponentStates), override?: boolean) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  elements,
  setElements,
  undo,
  redo,
  canUndo,
  canRedo,
  componentStates,
  setComponentStates
}) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isFigmaModalOpen, setFigmaModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [figmaImportError, setFigmaImportError] = useState<string | null>(null);
  const [viewTransform, setViewTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [activeStateName, setActiveStateName] = useState('base');


  const svgRef = useRef<SVGSVGElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const interaction = useRef<InteractionState>(null);
  const panStart = useRef<{x: number, y: number, tx: number, ty: number} | null>(null);
  const isInteracting = useRef(false);

  const getMousePosition = useCallback((e: React.MouseEvent | MouseEvent): { x: number; y: number } => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const { left, top } = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const worldX = (mouseX - viewTransform.x) / viewTransform.scale;
    const worldY = (mouseY - viewTransform.y) / viewTransform.scale;
    return { x: worldX, y: worldY };
  }, [viewTransform]);
  
  const addElement = (type: ShapeType) => {
    const newElementBase = {
      id: window.uuidv4(),
      type,
      x: 150,
      y: 100,
      rotation: 0,
      fill: `hsl(${Math.random() * 360}, 70%, 70%)`,
    };

    let newElement: CanvasElement;

    if (type === 'rect') {
      newElement = {
        ...newElementBase,
        width: 100,
        height: 60,
        cornerRadius: 0,
      };
    } else if (type === 'circle') {
      newElement = {
        ...newElementBase,
        width: 80,
        height: 80,
      };
    } else if (type === 'text') {
      newElement = {
        ...newElementBase,
        width: 120,
        height: 24,
        text: 'Hello World',
        fontSize: 20,
      };
    } else {
        return; // Should not happen
    }

    setElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };
  
  const addComponent = (component: typeof PRE_BUILT_COMPONENTS[0]) => {
    const groupId = window.uuidv4();
    const newElements: CanvasElement[] = component.elements.map(part => ({
      ...part,
      id: window.uuidv4(),
      groupId,
      x: part.x + 150,
      y: part.y + 100,
      rotation: 0,
    } as CanvasElement));
    setElements(prev => [...prev, ...newElements]);
    setSelectedElementId(newElements[0].id);
  };

  const handleElementMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    if (isPanning) return;
    setSelectedElementId(element.id);
    setActiveStateName('base');
    const pos = getMousePosition(e);
    interaction.current = {
      type: 'moving',
      startElements: elements.map(el => ({...el})), // Deep copy
      startX: pos.x,
      startY: pos.y,
    };
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    const selectedElement = elements.find(el => el.id === selectedElementId);
    if (!selectedElement) return;
    const pos = getMousePosition(e);
    interaction.current = {
      type: 'resizing',
      startElement: { ...selectedElement },
      handle,
      startX: pos.x,
      startY: pos.y,
    };
  };
  
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const selectedElement = elements.find(el => el.id === selectedElementId);
    if (!selectedElement) return;
    const pos = getMousePosition(e);
    const centerX = selectedElement.x + selectedElement.width / 2;
    const centerY = selectedElement.y + selectedElement.height / 2;
    const startAngle = Math.atan2(pos.y - centerY, pos.x - centerX) * 180 / Math.PI;
    interaction.current = {
      type: 'rotating',
      startElement: { ...selectedElement },
      startAngle,
      centerX,
      centerY,
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (panStart.current) {
        isInteracting.current = true;
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setViewTransform(prev => ({ ...prev, x: panStart.current!.tx + dx, y: panStart.current!.ty + dy }));
        return;
    }

    if (!interaction.current) return;
    isInteracting.current = true;

    const pos = getMousePosition(e);
    const currentInteraction = interaction.current;

    if (currentInteraction.type === 'moving') {
        const dx = pos.x - currentInteraction.startX;
        const dy = pos.y - currentInteraction.startY;
        
        const selected = currentInteraction.startElements.find(el => el.id === selectedElementId);
        const groupId = selected?.groupId;

        const updatedElements = currentInteraction.startElements.map(el => {
            if (groupId && el.groupId === groupId) {
                return { ...el, x: el.x + dx, y: el.y + dy };
            }
            if (el.id === selectedElementId && !groupId) {
                return { ...el, x: el.x + dx, y: el.y + dy };
            }
            return el;
        });
        setElements(updatedElements, true); // Override history
    } else if (currentInteraction.type === 'rotating') {
      const { startElement, centerX, centerY, startAngle } = currentInteraction;
      const currentAngle = Math.atan2(pos.y - centerY, pos.x - centerX) * 180 / Math.PI;
      const rotation = startElement.rotation + (currentAngle - startAngle);
      setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, rotation } : el), true);
    } else if (currentInteraction.type === 'resizing') {
      const { startElement, handle, startX, startY } = currentInteraction;
      const { x, y, width, height, rotation } = startElement;
      
      const dx = pos.x - startX;
      const dy = pos.y - startY;

      const rad = rotation * Math.PI / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      let newX = x, newY = y, newWidth = width, newHeight = height;

      if (handle.includes('r')) { newWidth += dx * cos + dy * sin; }
      if (handle.includes('l')) { 
        newWidth -= dx * cos + dy * sin; 
        newX += dx * cos + dy * sin;
      }
      if (handle.includes('b')) { newHeight += dy * cos - dx * sin; }
      if (handle.includes('t')) { 
        newHeight -= dy * cos - dx * sin; 
        newY += dy * cos - dx * sin;
      }

      const center = { x: startElement.x + startElement.width / 2, y: startElement.y + startElement.height / 2 };
      const newCenter = { x: newX + newWidth / 2, y: newY + newHeight / 2 };
      const centerDx = newCenter.x - center.x;
      const centerDy = newCenter.y - center.y;
      
      newX -= centerDx * (1-cos) + centerDy * sin;
      newY -= centerDy * (1-cos) - centerDx * sin;
      
      if (newWidth > 10 && newHeight > 10) {
        setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, x: newX, y: newY, width: newWidth, height: newHeight } : el), true);
      }
    }
  }, [getMousePosition, setElements, selectedElementId]);

  const handleMouseUp = useCallback(() => {
    if (interaction.current && isInteracting.current) {
        setElements(elements); // Commit final state to history
    }
    interaction.current = null;
    panStart.current = null;
    
    // Use a timeout to reset interaction flag after a short delay
    // This prevents the canvas click from firing immediately after a drag ends
    setTimeout(() => {
        isInteracting.current = false;
    }, 0);
  }, [elements, setElements]);

  useEffect(() => {
    const editorNode = editorContainerRef.current;
    if (!editorNode) return;
    
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    editorNode.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      editorNode.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (isPanning) {
        e.preventDefault();
        panStart.current = { x: e.clientX, y: e.clientY, tx: viewTransform.x, ty: viewTransform.y };
        return;
    }
    if (!isInteracting.current) {
      setSelectedElementId(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!svgRef.current) return;
    
    const { left, top } = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left; // mouse position relative to svg
    const mouseY = e.clientY - top;

    const zoomFactor = 1.1;
    const newScale = e.deltaY > 0 ? viewTransform.scale / zoomFactor : viewTransform.scale * zoomFactor;
    const clampedScale = Math.max(0.1, Math.min(newScale, 10));

    // The point in world coordinates that should stay under the mouse
    const worldX = (mouseX - viewTransform.x) / viewTransform.scale;
    const worldY = (mouseY - viewTransform.y) / viewTransform.scale;
    
    const newX = mouseX - worldX * clampedScale;
    const newY = mouseY - worldY * clampedScale;
    
    setViewTransform({ scale: clampedScale, x: newX, y: newY });
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    const selected = selectedElement;
    if (selected && selected.groupId && activeStateName !== 'base') {
      setComponentStates(prev => {
        const newStates = { ...prev };
        if (!newStates[selected.groupId!]) {
          newStates[selected.groupId!] = { states: [] };
        }
        let state = newStates[selected.groupId!].states.find(s => s.name === activeStateName);
        if (!state) {
          state = { name: activeStateName, overrides: {} };
          newStates[selected.groupId!].states.push(state);
        }
        if (!state.overrides[id]) {
          state.overrides[id] = {};
        }
        state.overrides[id] = { ...state.overrides[id], ...updates };
        return newStates;
      });
    } else {
       setElements(prev =>
        prev.map(el => (el.id === id ? { ...el, ...updates } : el))
      );
    }
  };

  const deleteElement = (id: string) => {
    const elementToDelete = elements.find(el => el.id === id);
    if (!elementToDelete) return;

    setElements(prev => {
        if (elementToDelete.groupId) {
            return prev.filter(el => el.groupId !== elementToDelete.groupId);
        }
        return prev.filter(el => el.id !== id);
    });
    setSelectedElementId(null);
  };

  const handleFigmaImport = async (url: string, token: string) => {
    setIsImporting(true);
    setFigmaModalOpen(false);
    setFigmaImportError(null);

    const fileKeyMatch = url.match(/file\/([a-zA-Z0-9]+)/);
    if (!fileKeyMatch || !fileKeyMatch[1]) {
        setFigmaImportError("Invalid Figma URL. Could not find file key.");
        setIsImporting(false);
        return;
    }
    const fileKey = fileKeyMatch[1];
    
    try {
        const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
            headers: {
                'X-Figma-Token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.err || `Figma API request failed with status ${response.status}`);
        }

        const data: FigmaFile = await response.json();
        
        const nodesToTransform = data.document.children?.[0]?.children;
        if (!nodesToTransform) {
            throw new Error("No nodes found on the first page of the Figma file.");
        }

        const newElements = transformFigmaNodes(nodesToTransform);

        if (newElements.length === 0) {
            throw new Error("No compatible elements (rectangles, ellipses, text) were found on the first page.");
        }

        setElements(prev => [...prev, ...newElements]);

    } catch (error) {
        console.error("Figma import failed:", error);
        setFigmaImportError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
        setIsImporting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setIsPanning(true);
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        deleteElement(selectedElementId);
      }
      
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      
      if (modKey && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
      if (modKey && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPanning(false);
        panStart.current = null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [selectedElementId, undo, redo, elements, deleteElement]);

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;
  const renderedElements = elements.map(el => {
    if (selectedElement?.groupId && el.groupId === selectedElement.groupId && activeStateName !== 'base') {
      const stateOverrides = componentStates[selectedElement.groupId]?.states.find(s => s.name === activeStateName)?.overrides[el.id];
      return { ...el, ...stateOverrides };
    }
    return el;
  });
  
  return (
    <>
      <FigmaImportModal 
        isOpen={isFigmaModalOpen}
        onClose={() => {
          setFigmaModalOpen(false);
          setFigmaImportError(null);
        }}
        onImport={handleFigmaImport}
      />
      <ExportCodeModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        elements={elements}
        selectedElement={selectedElement}
        componentStates={componentStates}
      />
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4" ref={editorContainerRef}>
        <div className="flex items-center gap-2 mb-4">
          {/* Controls */}
          <button onClick={undo} disabled={!canUndo} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-sky-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Undo (Ctrl+Z)"><UndoIcon /></button>
          <button onClick={redo} disabled={!canRedo} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-sky-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Redo (Ctrl+Y)"><RedoIcon /></button>
          <div className="h-6 w-px bg-slate-600 mx-2"></div>
          <button onClick={() => addElement('rect')} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-sky-500 hover:text-white transition-colors" title="Add Rectangle"><RectangleIcon /></button>
          <button onClick={() => addElement('circle')} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-sky-500 hover:text-white transition-colors" title="Add Circle"><CircleIcon /></button>
          <button onClick={() => addElement('text')} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-sky-500 hover:text-white transition-colors" title="Add Text"><TextIcon /></button>
          <div className="h-6 w-px bg-slate-600 mx-2"></div>
          {PRE_BUILT_COMPONENTS.map(comp => (<button key={comp.name} onClick={() => addComponent(comp)} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-sky-500 hover:text-white transition-colors" title={`Add ${comp.name}`}>{comp.icon}</button>))}
          <div className="h-6 w-px bg-slate-600 mx-2"></div>
          <button onClick={() => setFigmaModalOpen(true)} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-slate-600 hover:text-white transition-colors" title="Import from Figma"><FigmaImportIcon /></button>
          <button onClick={() => setExportModalOpen(true)} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-slate-600 hover:text-white transition-colors" title="Export Code"><ExportIcon /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
          <div className={`w-full h-[500px] bg-slate-900 rounded-lg overflow-hidden relative ${isPanning ? 'cursor-grab' : ''}`} onWheel={handleWheel}>
             {figmaImportError && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-sm px-4 py-2 rounded-md shadow-lg z-30">
                  <strong>Import Error:</strong> {figmaImportError}
              </div>
            )}
            {isImporting && (
              <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-20">
                <div className="text-center">
                  <svg className="animate-spin h-8 w-8 text-sky-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8
 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-4 text-white">Importing from Figma...</p>
                </div>
              </div>
            )}
            <svg ref={svgRef} width="100%" height="100%" onMouseDown={handleCanvasMouseDown} className="select-none">
              <g transform={`translate(${viewTransform.x}, ${viewTransform.y}) scale(${viewTransform.scale})`}>
                <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(71, 85, 105, 0.5)" strokeWidth="1"/></pattern></defs>
                <rect width="10000" height="10000" x="-5000" y="-5000" fill="url(#grid)" />
                {renderedElements.map(el => {
                  const transform = `translate(${el.x} ${el.y}) rotate(${el.rotation} ${el.width/2} ${el.height/2})`;
                  if (el.type === 'rect') {
                    return (
                      <g key={el.id} transform={transform} onMouseDown={(e) => handleElementMouseDown(e, el)} style={{cursor: 'move'}}>
                        <rect x={0} y={0} width={el.width} height={el.height} fill={el.fill} rx={el.cornerRadius || 0}/>
                      </g>
                    );
                  }
                  if (el.type === 'circle') {
                    return (
                      <g key={el.id} transform={transform} onMouseDown={(e) => handleElementMouseDown(e, el)} style={{cursor: 'move'}}>
                        <ellipse cx={el.width/2} cy={el.height/2} rx={el.width/2} ry={el.height/2} fill={el.fill}/>
                      </g>
                    );
                  }
                  if (el.type === 'text') {
                      return (
                        <g key={el.id} transform={transform} onMouseDown={(e) => handleElementMouseDown(e, el)} style={{cursor: 'move'}}>
                          <text x={0} y={el.height / 2} fill={el.fill} style={{ fontSize: `${el.fontSize || 20}px`, userSelect: 'none' }} dominantBaseline="middle">
                              {el.text}
                          </text>
                        </g>
                      )
                  }
                  return null;
                })}
                {selectedElement && <SelectionBox element={selectedElement} onResizeStart={handleResizeStart} onRotateStart={handleRotateStart} scale={viewTransform.scale}/>}
              </g>
            </svg>
             <div className="absolute bottom-2 right-2 bg-slate-900/50 text-white text-xs px-2 py-1 rounded">
              {Math.round(viewTransform.scale * 100)}%
            </div>
             {selectedElement?.groupId && activeStateName !== 'base' && (
                <div className="absolute top-2 left-2 bg-sky-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    Editing '{activeStateName}' state
                </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <PropertiesPanel 
                element={selectedElement} 
                onUpdate={updateElement} 
                onDelete={deleteElement}
                componentStates={componentStates}
                activeStateName={activeStateName}
            />
            {selectedElement?.groupId && (
                <StatesPanel
                    componentId={selectedElement.groupId}
                    componentStates={componentStates}
                    setComponentStates={setComponentStates}
                    activeStateName={activeStateName}
                    setActiveStateName={setActiveStateName}
                />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CanvasEditor;