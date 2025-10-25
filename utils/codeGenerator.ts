import { CanvasElement } from '../components/CanvasEditor';
import { ComponentStates } from '../types/states';

const camelToKebab = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

const getElementClassName = (el: CanvasElement) => `el-${el.id.substring(0, 8)}`;

const elementToBaseStyle = (el: CanvasElement): React.CSSProperties => {
    const styles: React.CSSProperties = {
        position: 'absolute',
        left: `${el.x.toFixed(1)}px`,
        top: `${el.y.toFixed(1)}px`,
        width: `${el.width.toFixed(1)}px`,
        height: `${el.height.toFixed(1)}px`,
        backgroundColor: el.type !== 'text' ? el.fill : 'transparent',
        color: el.type === 'text' ? el.fill : undefined,
        transform: `rotate(${el.rotation || 0}deg)`,
        boxSizing: 'border-box',
        transition: 'all 0.2s ease-in-out',
    };
    if (el.type === 'rect' && el.cornerRadius) styles.borderRadius = `${el.cornerRadius}px`;
    if (el.type === 'circle') styles.borderRadius = '50%';
    if (el.type === 'text' && el.fontSize) {
        styles.fontSize = `${el.fontSize}px`;
        styles.display = 'flex';
        styles.alignItems = 'center';
        styles.justifyContent = 'center'; // Center text within the box
    }
    return styles;
};

const stylesToString = (styles: React.CSSProperties) => {
    return Object.entries(styles)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `  ${camelToKebab(key)}: ${value};`)
        .join('\n');
}

export const generateComponentCss = (
    elements: CanvasElement[],
    componentStates?: ComponentStates[string],
    options: { scope?: string } = {}
): string => {
    const styles: string[] = [];
    const scopeSelector = options.scope ? `${options.scope} ` : '';

    const containerWidth = elements.length > 0 ? Math.max(...elements.map(e => e.x + e.width)).toFixed(1) : 0;
    const containerHeight = elements.length > 0 ? Math.max(...elements.map(e => e.y + e.height)).toFixed(1) : 0;
    styles.push(`${scopeSelector}.container {\n  position: relative;\n  width: ${containerWidth}px;\n  height: ${containerHeight}px;\n}`);
    
    elements.forEach(el => {
        styles.push(`${scopeSelector}.${getElementClassName(el)} {\n${stylesToString(elementToBaseStyle(el))}\n}`);
        
        componentStates?.states.forEach(state => {
            const override = state.overrides[el.id];
            if (override && Object.keys(override).length > 0) {
                const stateSelector = state.name === 'hover'
                    ? `${scopeSelector}.container:hover .${getElementClassName(el)}`
                    : `${scopeSelector}.container.${state.name} .${getElementClassName(el)}`;

                const overrideStyle: React.CSSProperties = {
                   backgroundColor: override.fill && el.type !== 'text' ? override.fill : undefined,
                   color: override.fill && el.type === 'text' ? override.fill : undefined,
                   width: override.width ? `${override.width.toFixed(1)}px` : undefined,
                   height: override.height ? `${override.height.toFixed(1)}px` : undefined,
                   left: override.x ? `${override.x.toFixed(1)}px` : undefined,
                   top: override.y ? `${override.y.toFixed(1)}px` : undefined,
                   transform: override.rotation !== undefined ? `rotate(${override.rotation}deg)`: undefined,
                   borderRadius: override.cornerRadius !== undefined ? `${override.cornerRadius}px` : undefined,
                   fontSize: override.fontSize !== undefined ? `${override.fontSize}px` : undefined,
                };
                
                const filteredOverrideStyle = Object.fromEntries(Object.entries(overrideStyle).filter(([, value]) => value !== undefined));

                if (Object.keys(filteredOverrideStyle).length > 0) {
                    styles.push(`${stateSelector} {\n${stylesToString(filteredOverrideStyle)}\n}`);
                }
            }
        });
    });

    return styles.join('\n\n');
}


const generateReactCode = (elements: CanvasElement[], componentName: string, componentStates?: ComponentStates[string]): string => {
    const customStates = componentStates?.states.filter(s => s.name !== 'base' && s.name !== 'hover') || [];
    const props = customStates.map(s => `is${s.name.charAt(0).toUpperCase() + s.name.slice(1)}`).join(', ');
    const propsInterface = customStates.map(s => `  is${s.name.charAt(0).toUpperCase() + s.name.slice(1)}?: boolean;`).join('\n');
    
    const css = generateComponentCss(elements, componentStates);

    const elementJSX = elements.map((el) => {
        if (el.type === 'text') {
            return `        <div className="${getElementClassName(el)}">${el.text || ''}</div>`;
        }
        return `        <div className="${getElementClassName(el)}"></div>`;
    }).join('\n');

    return `import React from 'react';
import './${componentName}.css';

interface ${componentName}Props {
${propsInterface}
}

const ${componentName}: React.FC<${componentName}Props> = ({ ${props} }) => {
  const containerClasses = [
    'container',
    ${customStates.map(s => `is${s.name.charAt(0).toUpperCase() + s.name.slice(1)} && '${s.name}'`).filter(Boolean).join(',\n    ')}
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
${elementJSX}
    </div>
  );
};

export default ${componentName};

/* In ${componentName}.css */
/*
${css}
*/
`;
};

export type Framework = 'React' | 'Vue' | 'Svelte' | 'Web Components' | 'IR (JSON)';

export const generateCode = (elements: CanvasElement[], framework: Framework, componentName = "MyComponent", componentStates?: ComponentStates[string]): string => {
    if (elements.length === 0) {
        return `// No elements to export. Add some elements to the canvas.`;
    }

    // Normalize coordinates to be relative to the top-left of the component group
    const minX = Math.min(...elements.map(el => el.x));
    const minY = Math.min(...elements.map(el => el.y));

    const relativeElements = elements.map(el => ({
        ...el,
        x: el.x - minX,
        y: el.y - minY,
    }));

    switch(framework) {
        case 'IR (JSON)':
            const ir = {
                elements: relativeElements,
                states: componentStates?.states || [],
            };
            return JSON.stringify(ir, null, 2);
        case 'React':
            return generateReactCode(relativeElements, componentName, componentStates);
        case 'Vue':
            return `// Vue code generation with states not implemented in this version.`;
        case 'Svelte':
            return `// Svelte code generation with states not implemented in this version.`;
        case 'Web Components':
            return `// Web Components code generation with states not implemented in this version.`;
        default:
            return `// Framework ${framework} not supported yet.`;
    }
}