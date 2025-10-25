import React, { useState } from 'react';
import { ComponentStates } from '../types/states';

interface StatesPanelProps {
    componentId: string;
    componentStates: ComponentStates;
    setComponentStates: (updater: (prev: ComponentStates) => ComponentStates) => void;
    activeStateName: string;
    setActiveStateName: (name: string) => void;
}

const StatesPanel: React.FC<StatesPanelProps> = ({ componentId, componentStates, setComponentStates, activeStateName, setActiveStateName }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newStateName, setNewStateName] = useState('');

    const states = componentStates[componentId]?.states || [];
    const availableStates = ['base', ...states.map(s => s.name)];

    const handleAddState = () => {
        if (!newStateName.trim() || availableStates.includes(newStateName)) {
            // Maybe show an error message
            setIsAdding(false);
            setNewStateName('');
            return;
        }

        setComponentStates(prev => {
            const newStates = { ...prev };
            if (!newStates[componentId]) {
                newStates[componentId] = { states: [] };
            }
            newStates[componentId].states.push({ name: newStateName, overrides: {} });
            return newStates;
        });
        
        setActiveStateName(newStateName);
        setIsAdding(false);
        setNewStateName('');
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">States</h3>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="text-sky-400 hover:text-sky-300 text-sm font-semibold"
                >
                    + Add
                </button>
            </div>
            
            <div className="space-y-2">
                {availableStates.map(stateName => (
                    <button 
                        key={stateName}
                        onClick={() => setActiveStateName(stateName)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${activeStateName === stateName ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-300 hover:bg-slate-700'}`}
                    >
                        {stateName}
                    </button>
                ))}
                
                {isAdding && (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newStateName}
                            onChange={(e) => setNewStateName(e.target.value.replace(/\s/g, ''))}
                            placeholder="hover, active..."
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleAddState()}
                            className="flex-grow bg-slate-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                         <button onClick={handleAddState} className="bg-sky-500 text-white text-xs px-2 rounded">Add</button>
                         <button onClick={() => setIsAdding(false)} className="bg-slate-600 text-white text-xs px-2 rounded">X</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatesPanel;
