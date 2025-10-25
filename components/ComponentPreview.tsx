import React, { useEffect, useMemo } from 'react';
import { CanvasElement } from './CanvasEditor';
import { ComponentStates } from '../types/states';
import { generateComponentCss } from '../utils/codeGenerator';

interface ComponentPreviewProps {
  elements: CanvasElement[];
  componentStates?: ComponentStates[string];
  activeCustomStates: string[];
  componentId: string;
}

const getElementClassName = (el: CanvasElement) => `el-${el.id.substring(0, 8)}`;

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ elements, componentStates, activeCustomStates, componentId }) => {
  const scopeClass = useMemo(() => `preview-${componentId.replace(/[^a-zA-Z0-9]/g, '')}`, [componentId]);

  const css = useMemo(() => {
    return generateComponentCss(elements, componentStates, { scope: `.${scopeClass}` });
  }, [elements, componentStates, scopeClass]);

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.id = `style-${scopeClass}`;
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);

    return () => {
      const existingTag = document.getElementById(`style-${scopeClass}`);
      if (existingTag) {
        document.head.removeChild(existingTag);
      }
    };
  }, [css, scopeClass]);
  
  const containerClasses = ['container', ...activeCustomStates].join(' ');
  const containerWidth = elements.length > 0 ? Math.max(...elements.map(e => e.x + e.width)) : 0;
  const containerHeight = elements.length > 0 ? Math.max(...elements.map(e => e.y + e.height)) : 0;

  return (
    <div className={scopeClass}>
      <div 
        className={containerClasses} 
        style={{ 
          position: 'relative', 
          width: `${containerWidth.toFixed(1)}px`, 
          height: `${containerHeight.toFixed(1)}px`, 
          margin: 'auto',
          transform: 'scale(1)', // Ensures consistent rendering
        }}
      >
        {elements.map(el => {
          if (el.type === 'text') {
            return <div key={el.id} className={getElementClassName(el)}>{el.text || ''}</div>;
          }
          return <div key={el.id} className={getElementClassName(el)}></div>;
        })}
      </div>
    </div>
  );
};

export default ComponentPreview;
