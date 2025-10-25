import React, { useState, useEffect, useMemo } from 'react';
import { CanvasElement } from './CanvasEditor';
import { Framework, generateCode } from '../utils/codeGenerator';
import CodeBlock from './CodeBlock';
import { ComponentStates } from '../types/states';
import ComponentPreview from './ComponentPreview';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  componentStates: ComponentStates;
}

type ExportScope = 'selection' | 'canvas';

const ExportCodeModal: React.FC<ExportCodeModalProps> = ({ isOpen, onClose, elements: allElements, selectedElement, componentStates }) => {
  const [framework, setFramework] = useState<Framework>('React');
  const [scope, setScope] = useState<ExportScope>('canvas');
  const [generatedCode, setGeneratedCode] = useState<string>('// Select options and generate code to preview.');
  const [activeCustomStates, setActiveCustomStates] = useState<string[]>([]);
  
  const { elementsToExport, statesToExport } = useMemo(() => {
    let elements: CanvasElement[] = [];
    let states: ComponentStates[string] | undefined;

    if (scope === 'selection' && selectedElement) {
      if (selectedElement.groupId) {
        elements = allElements.filter(el => el.groupId === selectedElement.groupId);
        states = componentStates[selectedElement.groupId];
      } else {
        elements = [selectedElement];
      }
    } else {
      elements = allElements;
    }
    return { elementsToExport: elements, statesToExport: states };
  }, [scope, selectedElement, allElements, componentStates]);
  
  const relativeElements = useMemo(() => {
    if (elementsToExport.length === 0) return [];
    
    const minX = Math.min(...elementsToExport.map(el => el.x));
    const minY = Math.min(...elementsToExport.map(el => el.y));

    return elementsToExport.map(el => ({
        ...el,
        x: el.x - minX,
        y: el.y - minY,
    }));
  }, [elementsToExport]);

  const customStates = useMemo(() => 
    statesToExport?.states.filter(s => s.name !== 'base' && s.name !== 'hover').map(s => s.name) || [], 
    [statesToExport]
  );
  
  const componentName = useMemo(() => {
    if (scope === 'selection' && selectedElement) {
        const textElement = elementsToExport.find(el => el.type === 'text' && el.text);
        if(textElement && textElement.text) {
             const cleanName = textElement.text.replace(/[^a-zA-Z0-9]/g, '');
             const validName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
             return validName.replace(/^\d+/, '') || 'MyComponent';
        }
    }
    return 'MyCanvasComponent';
  }, [scope, selectedElement, elementsToExport]);

  useEffect(() => {
    if (isOpen) {
        const initialScope = selectedElement ? 'selection' : 'canvas';
        setScope(initialScope);
        setGeneratedCode(`// Click "Generate Code" to see the output for the '${initialScope}' scope.`);
        setActiveCustomStates([]);
    }
  }, [isOpen, selectedElement]);
  
  const handleToggleState = (stateName: string) => {
    setActiveCustomStates(prev => 
      prev.includes(stateName) 
        ? prev.filter(s => s !== stateName)
        : [...prev, stateName]
    );
  };

  const handleGenerate = () => {
    const code = generateCode(elementsToExport, framework, componentName, statesToExport);
    setGeneratedCode(code);
  };
  
  if (!isOpen) return null;
  
  const lang = framework === 'IR (JSON)' ? 'json' : 'jsx';

  const frameworkOptions: Framework[] = ['React', 'Vue', 'Svelte', 'Web Components', 'IR (JSON)'];

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-6xl shadow-2xl flex flex-col"
        style={{height: '90vh'}}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4 flex-shrink-0">Export Component</h2>
        
        <div className="flex flex-wrap items-center gap-4 mb-4 flex-shrink-0 border-b border-slate-700 pb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Framework</label>
            <select
                value={framework}
                onChange={e => setFramework(e.target.value as Framework)}
                className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {frameworkOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Scope</label>
            <select
                value={scope}
                onChange={e => setScope(e.target.value as ExportScope)}
                className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="canvas">Entire Canvas</option>
              <option value="selection" disabled={!selectedElement}>Selected Component</option>
            </select>
          </div>
          <div className="flex-grow"></div>
          <button
              onClick={handleGenerate}
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 text-sm"
            >
              Generate Code
            </button>
        </div>

        <div className="flex-grow grid md:grid-cols-2 gap-6 min-h-0">
          <div className="flex flex-col gap-4 bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white flex-shrink-0">Interactive Preview</h3>
              <div className="flex-grow flex items-center justify-center overflow-hidden">
                {relativeElements.length > 0 ? (
                  <ComponentPreview
                      elements={relativeElements}
                      componentStates={statesToExport}
                      activeCustomStates={activeCustomStates}
                      componentId={(scope === 'selection' && selectedElement?.groupId) || 'canvas-preview'}
                  />
                ) : (
                  <div className="text-slate-500 text-sm">Nothing to preview.</div>
                )}
              </div>
              {customStates.length > 0 && (
                <div className="flex-shrink-0 border-t border-slate-700 pt-3">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Toggle States:</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {customStates.map(stateName => (
                          <label key={stateName} className="flex items-center gap-2 cursor-pointer">
                             <input 
                               type="checkbox"
                               checked={activeCustomStates.includes(stateName)}
                               onChange={() => handleToggleState(stateName)}
                               className="h-4 w-4 bg-slate-700 border-slate-600 rounded text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                             />
                             <span className="text-sm text-slate-300">{stateName}</span>
                          </label>
                        ))}
                    </div>
                </div>
              )}
          </div>
          <div className="flex flex-col min-h-0">
            <CodeBlock code={generatedCode} language={lang} className="h-full rounded-md overflow-hidden"/>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 flex-shrink-0 mt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-600 transition-all text-sm"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExportCodeModal;