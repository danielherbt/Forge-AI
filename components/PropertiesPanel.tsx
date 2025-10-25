import React from 'react';
import { CanvasElement } from './CanvasEditor';
// FIX: Import StateOverride to use as a type constraint for overridable properties.
import { ComponentStates, StateOverride } from '../types/states';

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
  componentStates: ComponentStates;
  activeStateName: string;
}

const PropertyInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-2 items-center">
    <label className="text-sm text-slate-400">{label}</label>
    {children}
  </div>
);

const NumberInput: React.FC<{ value: number; onChange: (val: number) => void }> = ({ value, onChange }) => (
    <input
        type="number"
        value={(value || 0).toFixed(1)}
        step="0.1"
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-slate-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
    />
);


const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onUpdate, onDelete, componentStates, activeStateName }) => {
  if (!element) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center text-slate-500">
        <p className="text-sm">Selecciona un elemento para editar sus propiedades.</p>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<CanvasElement>) => {
    onUpdate(element.id, updates);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdate({ text: e.target.value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdate({ fill: e.target.value });
  };
  
  // FIX: Constrain K to keys of StateOverride to ensure type-safe access on override objects. This resolves the error where K could be a key not present in StateOverride.
  const getDisplayValue = <K extends keyof StateOverride>(prop: K): CanvasElement[K] => {
    if (element.groupId && activeStateName !== 'base') {
        const override = componentStates[element.groupId]?.states
            .find(s => s.name === activeStateName)?.overrides[element.id]?.[prop];
        if (override !== undefined) {
            return override;
        }
    }
    return element[prop];
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2 capitalize">{element.type} Properties</h3>
      
      <div className="space-y-3">
        <PropertyInput label="Position X">
          <NumberInput value={getDisplayValue('x')} onChange={val => handleUpdate({ x: val })} />
        </PropertyInput>
        <PropertyInput label="Position Y">
          <NumberInput value={getDisplayValue('y')} onChange={val => handleUpdate({ y: val })} />
        </PropertyInput>
        
        <PropertyInput label="Width">
          <NumberInput value={getDisplayValue('width')} onChange={val => handleUpdate({ width: val })} />
        </PropertyInput>
        <PropertyInput label="Height">
          <NumberInput value={getDisplayValue('height')} onChange={val => handleUpdate({ height: val })} />
        </PropertyInput>
        <PropertyInput label="Rotation">
          <NumberInput value={getDisplayValue('rotation')} onChange={val => handleUpdate({ rotation: val })} />
        </PropertyInput>

        {element.type === 'rect' && (
            <PropertyInput label="Corner Radius">
              <NumberInput value={getDisplayValue('cornerRadius') || 0} onChange={val => handleUpdate({ cornerRadius: val })} />
            </PropertyInput>
        )}

        {element.type === 'text' && (
          <>
            <PropertyInput label="Text">
              <input
                  type="text"
                  value={getDisplayValue('text')}
                  onChange={handleTextChange}
                  className="w-full bg-slate-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </PropertyInput>
            <PropertyInput label="Font Size">
              <NumberInput value={getDisplayValue('fontSize') || 20} onChange={val => handleUpdate({ fontSize: val })} />
            </PropertyInput>
          </>
        )}

        <PropertyInput label="Fill Color">
            <div className="relative">
                <input
                    type="color"
                    value={getDisplayValue('fill')}
                    onChange={handleColorChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full h-7 rounded border border-slate-600" style={{ backgroundColor: getDisplayValue('fill') }}></div>
            </div>
        </PropertyInput>
      </div>

      <button
        onClick={() => onDelete(element.id)}
        className="w-full mt-4 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 font-semibold text-sm py-2 rounded-md transition-colors"
      >
        {element.groupId ? 'Delete Component' : 'Delete Element'}
      </button>
    </div>
  );
};

export default PropertiesPanel;