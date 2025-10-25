import React, { useState } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import Card from './components/Card';
import CodeBlock from './components/CodeBlock';
import CanvasEditor, { CanvasElement } from './components/CanvasEditor';
import { ARCHITECTURE_MODULES, CODE_EXAMPLES, DEV_PLAN, STACK, SYSTEM_MODULES, RocketIcon, CodeIcon, PaletteIcon, BrainIcon, VueIcon, ReactIcon, SvelteIcon, WebComponentsIcon, FigmaIcon, WasmIcon, TypescriptIcon, RustIcon, UserFlowIcon } from './constants';
import { useHistory } from './hooks/useHistory';
import { GoogleGenAI, Type } from '@google/genai';
import { ComponentStates } from './types/states';

type ChatMessage = {
  role: 'user' | 'ai' | 'loading' | 'error';
  content: React.ReactNode;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('React');

  const {
    state: elements,
    setState: setElementsWithHistory,
    undo: undoElements,
    redo: redoElements,
    canUndo: canUndoElements,
    canRedo: canRedoElements,
  } = useHistory<CanvasElement[]>([]);

  const {
    state: componentStates,
    setState: setComponentStates,
    undo: undoStates,
    redo: redoStates,
    canUndo: canUndoStates,
    canRedo: canRedoStates
  } = useHistory<ComponentStates>({});

  const setElements = (updater: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[]), override?: boolean) => {
    const newElements = typeof updater === 'function' ? updater(elements) : updater;

    // Clean up states for deleted components
    const elementIds = new Set(newElements.map(e => e.id));
    const allGroupIds = new Set(newElements.map(e => e.groupId).filter(Boolean));
    const activeStates = { ...componentStates };
    let statesChanged = false;
    for (const groupId in activeStates) {
      if (!allGroupIds.has(groupId)) {
        delete activeStates[groupId];
        statesChanged = true;
      }
    }
    if (statesChanged) {
      setComponentStates(activeStates, override);
    }
    
    setElementsWithHistory(newElements, override);
  };

  const undo = () => {
    undoElements();
    undoStates();
  };
  
  const redo = () => {
    redoElements();
    redoStates();
  };

  const canUndo = canUndoElements || canUndoStates;
  const canRedo = canRedoElements || canRedoStates;


  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'ai', content: '¡Hola! Describe el componente que quieres que diseñe para ti.' },
  ]);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isGenerating) return;

    const userMessage: ChatMessage = { role: 'user', content: aiPrompt };
    setChatHistory(prev => [...prev, userMessage]);
    const currentPrompt = aiPrompt;
    setAiPrompt('');
    setIsGenerating(true);
    setChatHistory(prev => [...prev, { role: 'loading', content: 'Pensando...' }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const canvasElementSchema = {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['rect', 'circle', 'text'], description: 'The type of shape.' },
          x: { type: Type.NUMBER, description: 'The x-coordinate of the top-left corner.' },
          y: { type: Type.NUMBER, description: 'The y-coordinate of the top-left corner.' },
          width: { type: Type.NUMBER, description: 'The width of the shape.' },
          height: { type: Type.NUMBER, description: 'The height of the shape.' },
          fill: { type: Type.STRING, description: "A hex color code, e.g., '#3b82f6'." },
          text: { type: Type.STRING, description: 'The text content, only for type "text".' },
          fontSize: { type: Type.INTEGER, description: 'The font size in pixels, only for type "text".' },
          cornerRadius: { type: Type.NUMBER, description: 'The corner radius, only for type "rect".' },
          rotation: { type: Type.NUMBER, description: 'The rotation angle in degrees.' }
        },
        required: ['type', 'x', 'y', 'width', 'height', 'fill']
      };

      const responseSchema = {
        type: Type.ARRAY,
        items: canvasElementSchema
      };

      const systemInstruction = "You are an expert UI designer. Your task is to generate a JSON representation of a UI component based on a user's text description. The JSON output must be an array of objects, where each object represents a shape on a canvas. Adhere strictly to the provided JSON schema. Coordinates should be relative to a small canvas (e.g., within a 400x400 area), starting from the top-left corner (0,0). Use basic shapes like 'rect', 'circle', and 'text'. Ensure the component is visually appealing and well-structured.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a component for: "${currentPrompt}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      const jsonString = response.text.trim();
      const generatedElements = JSON.parse(jsonString);

      if (!Array.isArray(generatedElements) || generatedElements.length === 0) {
        throw new Error("La IA no generó elementos válidos.");
      }
      
      const groupId = window.uuidv4();
      const newElements: CanvasElement[] = generatedElements.map((el: any) => ({
        ...el,
        id: window.uuidv4(),
        groupId: generatedElements.length > 1 ? groupId : undefined,
        rotation: el.rotation || 0,
        x: el.x + 50,
        y: el.y + 50,
      }));

      setElements(prev => [...prev, ...newElements]);

      setChatHistory(prev => prev.filter(m => m.role !== 'loading'));
      setChatHistory(prev => [...prev, { role: 'ai', content: `¡Componente "${currentPrompt}" generado y añadido al canvas!` }]);

    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      setChatHistory(prev => prev.filter(m => m.role !== 'loading'));
      setChatHistory(prev => [...prev, { role: 'error', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-300 min-h-screen antialiased">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        
        {/* Hero Section */}
        <section id="home" className="text-center pt-16 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-emerald-400">
            Component Forge AI
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            Diseña visualmente. Genera universalmente. Transforma tus diseños de Figma en código de producción, limpio y modular para cualquier framework.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="#arquitectura" className="bg-sky-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20">
              Explorar Arquitectura
            </a>
            <a href="#editor" className="bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-600 transition-all">
              Probar Editor
            </a>
          </div>
        </section>

        {/* Architecture Section */}
        <Section id="arquitectura" title="Arquitectura del Sistema" subtitle="Un enfoque de capas para máxima flexibilidad y escalabilidad.">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {ARCHITECTURE_MODULES.map(item => (
              <Card key={item.title} icon={item.icon} title={item.title} description={item.description} />
            ))}
          </div>
        </Section>

        {/* Visual Editor Section */}
        <Section id="editor" title="Editor Visual en Acción" subtitle="Crea, importa y genera componentes visualmente.">
          <div className="mt-12">
            <CanvasEditor 
              elements={elements}
              setElements={setElements}
              undo={undo}
              redo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              componentStates={componentStates}
              setComponentStates={setComponentStates}
            />
          </div>
        </Section>

        {/* Tech Stack Section */}
        <Section id="stack" title="Stack Tecnológico Óptimo" subtitle="Herramientas seleccionadas para un rendimiento y experiencia de desarrollo superiores.">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
                {STACK.map(tech => (
                     <div key={tech.name} className="flex flex-col items-center p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:bg-slate-800 hover:border-sky-500 transition-all transform hover:-translate-y-1">
                        <div className="h-12 w-12 text-slate-400 mb-4">{tech.icon}</div>
                        <h3 className="text-white font-semibold">{tech.name}</h3>
                        <p className="text-slate-400 text-sm text-center mt-1">{tech.desc}</p>
                    </div>
                ))}
            </div>
        </Section>
        
        {/* Code Generation Flow Section */}
        <Section id="flujo" title="Flujo de Generación de Código" subtitle="Desde el diseño visual hasta el componente funcional en cuatro simples pasos.">
            <div className="mt-12 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700" aria-hidden="true"></div>
                <div className="relative grid md:grid-cols-4 gap-8">
                    {[
                        { icon: <PaletteIcon />, title: "1. Diseño en el Canvas", description: "Crea o importa diseños usando una interfaz intuitiva similar a Figma." },
                        { icon: <CodeIcon />, title: "2. Conversión a IR", description: "El sistema traduce el diseño a una Representación Intermedia (IR) en formato JSON." },
                        { icon: <UserFlowIcon />, title: "3. Selección de Framework", description: "Elige el framework de destino: React, Vue, Svelte o Web Components." },
                        { icon: <RocketIcon />, title: "4. Generación y Previsualización", description: "El motor genera código idiomático y te permite previsualizarlo en tiempo real." },
                    ].map(step => (
                        <div key={step.title} className="flex flex-col items-center text-center p-6 bg-slate-800 rounded-lg border border-slate-700 z-10">
                            <div className="w-12 h-12 text-sky-400 mb-4">{step.icon}</div>
                            <h3 className="font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-400">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
        
        {/* Code Examples Section */}
        <Section id="ejemplos" title="Ejemplos de Código Generado" subtitle="Observa la calidad y consistencia del código para un mismo componente en diferentes frameworks.">
          <div className="mt-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700 bg-slate-800/50">
              {Object.keys(CODE_EXAMPLES).map(lang => (
                <button key={lang} onClick={() => setActiveTab(lang)} className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === lang ? 'bg-slate-700 text-sky-400' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                  {lang}
                </button>
              ))}
            </div>
            <CodeBlock code={CODE_EXAMPLES[activeTab as keyof typeof CODE_EXAMPLES].code} language={CODE_EXAMPLES[activeTab as keyof typeof CODE_EXAMPLES].lang} />
          </div>
        </Section>

        {/* Development Plan Section */}
        <Section id="plan" title="Plan de Desarrollo por Fases" subtitle="Una hoja de ruta clara desde el Producto Mínimo Viable hasta la versión completa.">
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                {DEV_PLAN.map(phase => (
                    <div key={phase.title} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-xl text-sky-400 mb-3">{phase.title}</h3>
                        <p className="text-slate-400 text-sm mb-4">{phase.description}</p>
                        <ul className="space-y-2">
                            {phase.features.map(feature => (
                                <li key={feature} className="flex items-start text-sm">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </Section>

        {/* AI Integration Section */}
        <Section id="ia" title="Integración con IA" subtitle="Acelerando la creación de interfaces con Gemini.">
            <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Asistente de Diseño Inteligente</h3>
                    <p className="text-slate-400 mb-6">
                        Component Forge se potencia con IA para entender lenguaje natural y automatizar tareas complejas. Describe el componente que necesitas, y nuestro asistente generará un primer borrador visual y de código, que podrás refinar en el canvas.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <BrainIcon className="w-6 h-6 mr-3 text-sky-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-white">Generación desde Texto</h4>
                                <p className="text-slate-400 text-sm">Crea estructuras complejas de UI (formularios, tarjetas, layouts) a partir de una simple descripción en texto.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <BrainIcon className="w-6 h-6 mr-3 text-sky-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-white">Optimización Automática</h4>
                                <p className="text-slate-400 text-sm">La IA sugiere mejoras de accesibilidad, rendimiento y responsive design sobre tus diseños existentes.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-2xl shadow-slate-950/50">
                    <div className="h-64 flex flex-col">
                        <div className="flex-grow space-y-3 p-2 overflow-y-auto">
                           {chatHistory.map((msg, index) => {
                              if (msg.role === 'user') {
                                return (
                                  <div key={index} className="flex justify-end">
                                    <p className="bg-sky-500 text-white text-sm rounded-lg py-2 px-3 max-w-xs">{String(msg.content)}</p>
                                  </div>
                                );
                              }
                              if (msg.role === 'ai' || msg.role === 'loading' || msg.role === 'error') {
                                const bgColor = msg.role === 'error' ? 'bg-red-900/50' : 'bg-slate-700';
                                return (
                                  <div key={index} className="flex justify-start">
                                    <div className={`${bgColor} text-slate-300 text-sm rounded-lg py-2 px-3 max-w-xs`}>
                                      {msg.role === 'loading' && <div className="flex items-center gap-2"><div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-150"></div><div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-300"></div></div>}
                                      {msg.role === 'error' && <p className="text-red-400">{String(msg.content)}</p>}
                                      {msg.role === 'ai' && <>{msg.content}</>}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                        </div>
                        <form onSubmit={handleAiSubmit} className="flex-shrink-0 p-2 border-t border-slate-700">
                            <input 
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder={isGenerating ? "Generando..." : "Describe un componente..."}
                                disabled={isGenerating}
                                className="w-full bg-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </section>
        
      </main>
      <footer className="text-center py-8 border-t border-slate-800">
        <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Component Forge AI. Un concepto de arquitectura de software.</p>
      </footer>
    </div>
  );
}

export default App;
