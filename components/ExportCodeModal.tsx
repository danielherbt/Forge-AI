import React, { useState, useEffect, useMemo } from 'react';
import { CanvasElement } from './CanvasEditor';
import { Framework, generateCode } from '../utils/codeGenerator';
import { CODE_EXAMPLES } from '../constants';
import CodeBlock from './CodeBlock';
import { ComponentStates } from '../types/states';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  componentStates: ComponentStates;
}

type ExportScope = 'selection' | 'canvas';

const ExportCodeModal: React.FC<ExportCodeModalProps> = ({ isOpen, onClose, elements, selectedElement, componentStates }) => {
  const [framework, setFramework] = useState<Framework>('React');
  const [scope, setScope] = useState<ExportScope>('canvas');
  const [generatedCode, setGeneratedCode] = useState<string>('// Select options and click "Generate Code"');
  
  const componentName = useMemo(() => {
    if (scope === 'selection' && selectedElement) {
        const componentElements = selectedElement.groupId 
            ? elements.filter(el => el.groupId === selectedElement.groupId)
            : [selectedElement];
        
        const textElement = componentElements.find(el => el.type === 'text' && el.text);
        if(textElement && textElement.text) {
             const cleanName = textElement.text.replace(/[^a-zA-Z0-9]/g, '');
             const validName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
             return validName.replace(/^\d+/, '') || 'MyComponent';
        }
    }
    return 'MyCanvasComponent';
  }, [scope, selectedElement, elements]);

  useEffect(() => {
    setGeneratedCode('// Select options and click "Generate Code"');
    if (selectedElement) {
        setScope('selection');
    } else {
        setScope('canvas');
    }
  }, [isOpen, selectedElement]);

  const handleGenerate = () => {
    let elementsToExport: CanvasElement[] = [];
    let statesToExport: ComponentStates[string] | undefined;

    if (scope === 'selection' && selectedElement) {
      if (selectedElement.groupId) {
        elementsToExport = elements.filter(el => el.groupId === selectedElement.groupId);
        statesToExport = componentStates[selectedElement.groupId];
      } else {
        elementsToExport = [selectedElement];
        // No states for single elements
      }
    } else {
      elementsToExport = elements;
      // Note: Exporting states for the entire canvas is not supported in this model.
      // It would require grouping all elements into a root component.
    }

    const code = generateCode(elementsToExport, framework, componentName, statesToExport);
    setGeneratedCode(code);
  };

  if (!isOpen) return null;
  
  const lang = CODE_EXAMPLES[framework as keyof typeof CODE_EXAMPLES].lang;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-3xl shadow-2xl flex flex-col"
        style={{height: '90vh'}}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4 flex-shrink-0">Export Component Code</h2>
        
        <div className="flex flex-wrap items-center gap-4 mb-4 flex-shrink-0">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Framework</label>
            <select
                value={framework}
                onChange={e => setFramework(e.target.value as Framework)}
                className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {Object.keys(CODE_EXAMPLES).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
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

        <div className="flex-grow min-h-0">
            <CodeBlock code={generatedCode} language={lang} className="h-full rounded-md overflow-hidden"/>
        </div>

        <div className="flex justify-end gap-3 pt-4 flex-shrink-0">
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
