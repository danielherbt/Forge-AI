import React from 'react';

// Generic Icons
export const RocketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
export const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
export const PaletteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
export const BrainIcon = ({className = "w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /><path d="M4.5 12.5l7-7 M13.5 19.5l7-7" /><path d="M9.5 2.5l1.5 1.5" /><path d="M12.5 5.5l1.5 1.5" /><path d="M15.5 8.5l1.5 1.5" /></svg>;
export const ForgeIcon = ({className = "w-6 h-6"}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.353 10.846a1.5 1.5 0 0 1-1.5-1.5V5.864a.5.5 0 0 0-.949-.224l-3.26 6.518a.5.5 0 0 0 .45.742H9.5a.5.5 0 0 1 0 1H7.051a.5.5 0 0 0-.45.742l3.26 6.518a.5.5 0 0 0 .949-.224v-3.482a1.5 1.5 0 0 1 1.5-1.5h2.518a.5.5 0 0 0 .45-.742l-3.26-6.518a.5.5 0 0 0-.949.224v3.482Z"/><path fillRule="evenodd" d="M12 22.5a10.5 10.5 0 1 0 0-21 10.5 10.5 0 0 0 0 21Zm0-1.5a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" clipRule="evenodd"/></svg>;
export const UserFlowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;

// Editor Icons
export const RectangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" /></svg>;
export const CircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>;
export const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>;
export const UndoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" /></svg>;
export const RedoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-4-4m4 4l-4 4" /></svg>;
export const ButtonComponentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
export const UserAvatarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" /></svg>;
export const FigmaImportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 5a1 1 0 011-1h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H12a1 1 0 011 1v1a1 1 0 002 0V8a3 3 0 00-3-3H9.414a3 3 0 00-2.121.879L6 7.172A3 3 0 004.414 8H4a1 1 0 01-1-1V6a1 1 0 011-1zm12 5a1 1 0 00-1-1h-1.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293H8a1 1 0 00-1 1v1a1 1 0 01-2 0v-1a3 3 0 013-3h1.586a3 3 0 012.121.879L14 12.172a3 3 0 011.586.828H16a1 1 0 001-1v-1z"/></svg>;
export const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;


// Framework Icons
export const ReactIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor"><title>React</title><path d="M12.001 2.002a.998.998 0 00-.5.143l-9.52 5.424a1 1 0 00-.498.868v10.849a1 1 0 00.5.868l9.52 5.424a1 1 0 001 0l9.52-5.424a1 1 0 00.5-.868V8.437a1 1 0 00-.5-.868L12.5 2.145a.998.998 0 00-.5-.143zm-8.52 6.3L12 3.931l8.52 4.371v8.738L12 21.411l-8.52-4.371V8.302zm1.683.973L12 12.396l6.837-3.121-1.683-.972-5.154 3.033-5.154-3.033-1.683.972zm0 2.231l3.366 1.908v3.816l-3.366-1.908v-3.816zm8.671 0l3.366 1.908-3.366 1.908v-3.816zm-5.305 3.053l1.939 1.107v2.215l-1.939-1.108v-2.214z"/></svg>;
export const VueIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor"><title>Vue.js</title><path d="M24 1.61h-9.84L12 5.16 9.84 1.61H0l12 20.78L24 1.61zM3.84 3.11h3.36l4.8 8.31 4.8-8.31h3.36L12 18.06 3.84 3.11z"/></svg>;
export const SvelteIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor"><title>Svelte</title><path d="M22.56 12.128c.287-.39.11-1.002-.373-1.288l-1.84-1.07-5.52-9.456c-.287-.49-.9-.72-1.44-.492l-1.84 1.07c-.48.287-.71.898-.492 1.44l3.52 6.09-3.41 1.98-7.92-7.8c-.372-.373-1.002-.373-1.373 0l-1.84 1.84c-.373.373-.373 1.002 0 1.373l7.92 7.8-7.92 7.8c-.373.373-.373 1.002 0 1.373l1.84 1.84c.373.373 1.002.373 1.373 0l7.92-7.8 3.41 1.98-3.52 6.09c-.218.542.012 1.153.492 1.44l1.84 1.07c.542.218 1.153-.002 1.44-.492l5.52-9.457 1.84-1.07c.482-.286.655-.898.372-1.288zm-11.04 1.47-5.52-3.12 5.52-3.12 5.52 3.12-5.52 3.12z"/></svg>;
export const WebComponentsIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor"><title>Web Components</title><path d="M11.996 2.5a.5.5 0 0 1 .491.565l-1.746 8.423a.5.5 0 0 1-.982-.129l1.746-8.423a.5.5 0 0 1 .491-.436zM9.982 7.155a.5.5 0 0 1 .632-.326l7.746 2.822a.5.5 0 0 1 .116.906l-7.746 4.79a.5.5 0 0 1-.748-.58l1.621-4.79-1.621-2.822zM4.498 8.017a.5.5 0 0 1 .374-.815l8.136-2.583a.5.5 0 0 1 .596.786L6.502 18.06a.5.5 0 0 1-.97-.243l-1.034-9.8z m9.998.016a.5.5 0 0 1 .499.499v8.435a.5.5 0 1 1-1 0V8.532a.5.5 0 0 1 .501-.5zM12 0a12 12 0 1 0 0 24A12 12 0 0 0 12 0z"/></svg>;
export const FigmaIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor"><title>Figma</title><path d="M12 24a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-6zm0-6a6 6 0 0 1 6-6h6v6a6 6 0 0 1-6 6h-6zm0-12a6 6 0 0 1 6-6h6v6a6 6 0 0 1-6 6h-6zm-6 6a6 6 0 0 0 6 6v-6a6 6 0 0 0-6-6z"/></svg>;
export const WasmIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor"><title>WebAssembly</title><path d="M12.24 6.13v3.72h3.96v-3.72zm-4.32 0v3.72h3.96v-3.72zM3.6 6.13v3.72h3.96v-3.72zm12.96 0v3.72h3.96v-3.72zm-8.64 4.08v3.72h3.96v-3.72zm-4.32 0v3.72h3.96v-3.72zm12.96 0v3.72h3.96v-3.72zm-4.32 0v3.72h3.96v-3.72zm-4.32 4.08v3.72h3.96v-3.72zM3.6 14.29v3.72h3.96v-3.72zm12.96 0v3.72h3.96v-3.72zM0 24h24V0H0zm2.4-2.4v-19.2h19.2v19.2z"/></svg>;
export const TypescriptIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor"><title>TypeScript</title><path d="M1.5 0 h21 v21 h-21 z M3 3 v18 h18 V3 z M6.404 11.232 l3.4-3.396 h2.4 V18 h2.4 V7.836 h2.4 l3.4 3.396 v-2.4 l-4.596-4.596 h-4.8 v13.5 h-2.4z"/></svg>;
export const RustIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor"><title>Rust</title><path d="M24 12.43L19.52 6.1l-6.19 2.834L19.45 12.43l-6.12 3.494 6.19 2.834L24 12.43zm-13.43 0L4.48 6.1l6.19 2.834L4.55 12.43l6.12 3.494-6.19 2.834L10.57 12.43zm.86-10.02a.557.557 0 00-.73-.59l-1.95.89v2.1l1.95-.89a.557.557 0 00.59-.73l.14-.38zm-2.81 19.18a.557.557 0 00.73.59l1.95-.89v-2.1l-1.95.89a.557.557 0 00-.59.73l-.14.38zM8.9 12.43a2.68 2.68 0 00-2.68 2.68h5.36a2.68 2.68 0 00-2.68-2.68zm6.2 0a2.68 2.68 0 00-2.68 2.68h5.36a2.68 2.68 0 00-2.68-2.68zm-3.1-6.2a2.68 2.68 0 002.68-2.68H9.32a2.68 2.68 0 002.68 2.68z"/></svg>;


// Content for sections
export const ARCHITECTURE_MODULES = [
  { icon: <PaletteIcon />, title: "Editor Visual", description: "Un canvas web interactivo y de alto rendimiento construido con WebGL/WASM para una experiencia de diseño fluida y potente." },
  { icon: <CodeIcon />, title: "Representación Intermedia (IR)", description: "Una capa de abstracción agnóstica al framework que describe la UI, el estado y las interacciones en un formato JSON estructurado." },
  { icon: <RocketIcon />, title: "Motor de Generación de Código", description: "El núcleo que interpreta la IR y utiliza 'adaptadores' específicos para generar código limpio y idiomático para cada framework." },
  { icon: <UserFlowIcon />, title: "Gestor de Design System", description: "Permite definir y consumir tokens de diseño (colores, tipografía, espaciado) que se traducen en variables CSS o temas." },
];

export const SYSTEM_MODULES = [
  // This could be used for a more detailed section if needed
];

export const STACK = [
  { name: 'React & TypeScript', desc: 'Para el frontend del editor', icon: <ReactIcon/> },
  { name: 'Figma Plugin API', desc: 'Para importar diseños existentes', icon: <FigmaIcon/> },
  { name: 'WebAssembly / Rust', desc: 'Para el motor de renderizado del canvas', icon: <WasmIcon /> },
  { name: 'Acorn (JS Parser)', desc: 'Para analizar y generar código', icon: <TypescriptIcon /> },
];

export const PRE_BUILT_COMPONENTS = [
    {
        name: 'Button',
        icon: <ButtonComponentIcon />,
        elements: [
            { type: 'rect', x: 0, y: 0, width: 120, height: 40, fill: '#3b82f6', cornerRadius: 8 },
            { type: 'text', x: 25, y: 10, width: 70, height: 20, text: 'Click Me', fill: '#ffffff', fontSize: 16 }
        ]
    },
    {
        name: 'User Profile',
        icon: <UserAvatarIcon />,
        elements: [
            { type: 'circle', x: 0, y: 0, width: 50, height: 50, fill: '#9ca3af' },
            { type: 'text', x: 60, y: 8, width: 80, height: 18, text: 'User Name', fill: '#e5e7eb', fontSize: 14 },
            { type: 'text', x: 60, y: 28, width: 80, height: 16, text: '@username', fill: '#6b7281', fontSize: 12 }
        ]
    }
];

export const CODE_EXAMPLES = {
  React: {
    lang: 'jsx',
    code: `import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  primary = false,
}) => {
  const mode = primary 
    ? 'bg-blue-500 text-white' 
    : 'bg-gray-200 text-gray-800';
  return (
    <button
      type="button"
      className={\`px-4 py-2 rounded font-bold \${mode}\`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};`
  },
  Vue: {
    lang: 'html',
    code: `<template>
  <button :class="classes" @click="handleClick">
    {{ label }}
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  primary: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);

const classes = computed(() => [
  'px-4', 'py-2', 'rounded', 'font-bold',
  {
    'bg-blue-500 text-white': props.primary,
    'bg-gray-200 text-gray-800': !props.primary,
  }
]);

const handleClick = () => {
  emit('click');
};
</script>`
  },
  Svelte: {
    lang: 'html',
    code: `<script>
  export let label;
  export let primary = false;
</script>

<button
  class="px-4 py-2 rounded font-bold"
  class:bg-blue-500={primary}
  class:text-white={primary}
  class:bg-gray-200={!primary}
  class:text-gray-800={!primary}
  on:click
>
  {label}
</button>`
  },
  'Web Components': {
    lang: 'js',
    code: `const template = document.createElement('template');
template.innerHTML = \`
  <style>
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-weight: bold;
      border: none;
      cursor: pointer;
    }
    .primary {
      background-color: #3b82f6;
      color: white;
    }
    .secondary {
      background-color: #e5e7eb;
      color: #1f2937;
    }
  </style>
  <button><slot></slot></button>
\`;

class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['primary'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const button = this.shadowRoot.querySelector('button');
    if (name === 'primary') {
      button.classList.toggle('primary', this.hasAttribute('primary'));
      button.classList.toggle('secondary', !this.hasAttribute('primary'));
    }
  }
}`
  },
};

export const DEV_PLAN = [
    { 
        title: "Fase 1: MVP",
        description: "Validar la funcionalidad principal: diseño de componentes básicos y generación de código para un solo framework.",
        features: [
            "Editor visual con formas básicas y texto.",
            "Panel de propiedades (color, tipografía, espaciado).",
            "Generador de código para React con Tailwind CSS.",
            "Exportación de componentes individuales."
        ]
    },
    { 
        title: "Fase 2: Versión 1.0",
        description: "Expandir a múltiples frameworks y mejorar la capacidad del editor, introduciendo el concepto de estado.",
        features: [
            "Soporte para Vue, Svelte y Web Components.",
            "Introducción de componentes anidados y auto-layout.",
            "Gestor de tokens de diseño básico.",
            "Integración con Figma para importación."
        ]
    },
    { 
        title: "Fase 3: Versión Completa y IA",
        description: "Convertirse en una plataforma completa de diseño a código con capacidades inteligentes.",
        features: [
            "Integración de IA (Gemini) para generación de UI desde texto.",
            "Sugerencias de optimización por IA.",
            "Sistema de versionado de componentes.",
            "Creación de interfaces y páginas completas."
        ]
    }
];