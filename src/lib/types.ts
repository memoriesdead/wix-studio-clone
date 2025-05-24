import { CSSProperties } from 'react';

// Defines the types of components available in the builder
// This will expand significantly based on the "Component Palette Features"
export enum BuilderComponentType {
  Text = 'text',
  Image = 'image',
  Button = 'button',
  Section = 'section',
  Container = 'container',
  Heading = 'heading',
  Icon = 'icon',
  Divider = 'divider',
  Spacer = 'spacer',
  Columns = 'columns',
  Grid = 'grid',
  // Add more types as specified in the prompt
}

// Base properties common to all components
export interface BaseComponentProps {
  id: string; // Unique identifier for the instance
  type: BuilderComponentType;
  name: string; // User-friendly name or label for the layer panel
}

// Properties for a component item as it appears in the palette
export interface PaletteItem extends BaseComponentProps {
  isPaletteItem: true;
  defaultWidth?: number | string; // Default width when dropped on canvas (can be % or px)
  defaultHeight?: number | string; // Default height when dropped on canvas (can be % or px)
  // Any other default properties specific to the component type
  // e.g., defaultText for a Text component
  defaultProps?: Record<string, any>;
}

// Properties for a component instance placed on the canvas
export interface CanvasComponentInstance extends BaseComponentProps {
  isPaletteItem: false;
  left: number;
  top: number;
  width: number;
  height: number;
  parentId?: string | null; // For nesting components
  props: Record<string, any>; // Component-specific properties (e.g., text content, image URL, button style)
  style?: CSSProperties; // General CSS styles applied directly
  // TODO: Add fields for responsive settings, animations, etc.
}

// Union type for any component data within the builder
export type BuilderComponentData = PaletteItem | CanvasComponentInstance;

// Data structure for the item being dragged by @dnd-kit
// This can be a new item from the palette or an existing item on the canvas
export interface DndDragItem {
  id: string; // Can be original palette ID or canvas instance ID
  type: BuilderComponentType; // The type of component being dragged
  name: string;
  isPaletteItem: boolean; // True if dragged from palette, false if dragged from canvas
  initialData: PaletteItem | CanvasComponentInstance; // The full data of the item at drag start
  // For items from palette, we might include default dimensions
  width?: number;
  height?: number;
  // For items from canvas, we might include original position if needed for calculations
  originalLeft?: number;
  originalTop?: number;
}

// Structure for storing project data (e.g., in local storage or Supabase)
export interface ProjectData {
  id: string; // Project ID
  name: string;
  pages: PageData[];
  // Global styles, settings, etc.
}

export interface PageData {
  id: string; // Page ID
  name: string;
  path: string; // e.g., '/', '/about'
  components: CanvasComponentInstance[];
  // Page-specific settings (SEO, background, etc.)
}

// History state for undo/redo
export type HistoryEntry = CanvasComponentInstance[];

// Props for components that will be rendered on the canvas
// This will be used by a generic component renderer later
export interface RenderableComponentProps extends CanvasComponentInstance { // Renamed from CanvasComponentData for clarity
  isSelected?: boolean;
  onSelect?: (id: string, isShiftPressed: boolean) => void;
  // Any other props needed for rendering and interaction
}
