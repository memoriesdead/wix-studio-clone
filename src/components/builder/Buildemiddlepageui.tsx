"use client";

import React, { CSSProperties } from 'react';
import { ProfessionalCanvas } from '@/components/builder/BuilderCanvas'; // Changed import
import PropertiesPanel from '@/components/builder/PropertiesPanel';
import { CanvasComponentInstance, ResponsiveStyles } from '@/lib/types';

interface BuildemiddlepageuiProps {
  // Props for BuilderCanvas
  activeBreakpoint: 'desktop' | 'tablet' | 'mobile';
  canvasComponents: CanvasComponentInstance[];
  setCanvasComponents: React.Dispatch<React.SetStateAction<CanvasComponentInstance[]>>;
  selectedComponentIds: string[];
  setSelectedComponentIds: React.Dispatch<React.SetStateAction<string[]>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isGridVisible: boolean;
  gridSize: number;
  updateHistory: (newCanvasState: CanvasComponentInstance[]) => void;
  smartGuidesToRender: Array<{ type: 'x' | 'y'; position: number; start: number; end: number }>;
  marqueeRect: { x: number; y: number; width: number; height: number } | null;

  // Props for PropertiesPanel
  onUpdateProperty: (
    componentId: string,
    propertyPath: string,
    value: any,
    breakpoint?: keyof ResponsiveStyles
  ) => void;
}

const Buildemiddlepageui: React.FC<BuildemiddlepageuiProps> = ({
  activeBreakpoint,
  canvasComponents,
  setCanvasComponents,
  selectedComponentIds,
  setSelectedComponentIds,
  zoomLevel,
  setZoomLevel,
  canvasOffset,
  setCanvasOffset,
  isGridVisible,
  gridSize,
  updateHistory,
  smartGuidesToRender,
  marqueeRect,
  onUpdateProperty,
}) => {
  const selectedComponent = canvasComponents.find(c => c.id === selectedComponentIds[0]);

  return (
    <div className="flex flex-1 relative"> {/* This container will hold canvas and properties panel */}
      <ProfessionalCanvas
        deviceMode={activeBreakpoint} // Corrected prop name
        canvasComponents={canvasComponents}
        setCanvasComponents={setCanvasComponents}
        selectedComponentIds={selectedComponentIds}
        setSelectedComponentIds={setSelectedComponentIds}
        zoomLevel={zoomLevel}
        // setZoomLevel is not a prop of ProfessionalCanvas
        canvasOffset={canvasOffset}
        setCanvasOffset={setCanvasOffset}
        // isGridVisible is not a prop of ProfessionalCanvas (it has internal showGrid)
        // gridSize is not a prop of ProfessionalCanvas
        updateHistory={updateHistory}
        // smartGuidesToRender is not a prop of ProfessionalCanvas
        // marqueeRect is not a prop of ProfessionalCanvas
      />
      <PropertiesPanel
        selectedComponent={selectedComponent}
        allCanvasComponents={canvasComponents}
        onUpdateProperty={onUpdateProperty}
      />
    </div>
  );
};

export default Buildemiddlepageui;
