import { CanvasElement } from '../components/CanvasEditor';

export type StateOverride = Partial<Omit<CanvasElement, 'id' | 'type' | 'groupId'>>;

export interface ComponentState {
  name: string;
  overrides: {
    [elementId: string]: StateOverride;
  };
}

export interface ComponentStates {
  [groupId: string]: {
    states: ComponentState[];
  };
}
