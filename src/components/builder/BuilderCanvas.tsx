"use client";

import React, { CSSProperties, useCallback, useRef, useState, useEffect } from 'react';
import {
  useDraggable,
  useDroppable,
  // DndContext, // Will be used in page.tsx
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  // Active, // Not directly used in this component's props
  // Over // Not directly used in this component's props
} from '@dnd-kit/core';
import {
  CanvasComponentInstance,
  DndDragItem,
  BuilderComponentType // Import BuilderComponentType
} from '@/lib/types';


// Interface for the component rendered on the canvas, now using @dnd-kit
interface DraggableCanvasItemProps {
  component: CanvasComponentInstance;
  allCanvasComponents: CanvasComponentInstance[]; // Add allCanvasComponents
  isSelected?: boolean;
  onSelect?: (id: string, isShiftPressed: boolean) => void;
  zoomLevel: number;
  selectedComponentIds: string[]; // To pass down for children's selection state
}

const DraggableCanvasItem: React.FC<DraggableCanvasItemProps> = ({
  component,
  allCanvasComponents,
  isSelected,
  onSelect,
  zoomLevel,
  selectedComponentIds,
}) => {
  const { attributes, listeners, setNodeRef: setDraggableNodeRef, transform, isDragging } = useDraggable({
    id: component.id,
    data: {
      id: component.id,
      type: component.type,
      name: component.name,
      isPaletteItem: false,
      initialData: component,
      originalLeft: component.left,
      originalTop: component.top,
      width: component.width,
      height: component.height,
    } as DndDragItem,
  });

  const isContainer = component.type === BuilderComponentType.Container;

  const { setNodeRef: setDroppableNodeRef, isOver: isDroppableOver } = useDroppable({
    id: `container-drop-${component.id}`,
    disabled: !isContainer,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDraggableNodeRef(node);
    if (isContainer) {
      setDroppableNodeRef(node);
    }
  };

  const style: CSSProperties = {
    position: 'absolute', // Children will be positioned relative to this
    left: component.left,
    top: component.top,
    width: component.width,
    height: component.height,
    cursor: 'move',
    opacity: isDragging ? 0.75 : 1,
    border: isSelected 
      ? '2px solid var(--theme-accent-primary)' 
      : isContainer && isDroppableOver 
        ? '2px dashed var(--theme-accent-secondary)' // Highlight for drop target
        : '1px solid var(--theme-border-primary)',
    backgroundColor: isSelected 
      ? 'rgba(var(--theme-accent-primary-rgb, 0, 212, 255),0.1)' 
      : isContainer && isDroppableOver
        ? 'rgba(var(--theme-accent-secondary-rgb, 255, 165, 0), 0.05)' // Different highlight for drop
        : 'var(--theme-bg-tertiary)',
    boxSizing: 'border-box',
    zIndex: isDragging ? 1000 : 'auto',
    color: 'var(--theme-text-primary)',
    // overflow: 'hidden', // Important for containing children if they exceed bounds
  };

  if (transform) {
    style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  }

  const childComponents = isContainer 
    ? allCanvasComponents.filter(c => c.parentId === component.id)
    : [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-1 shadow-md rounded-md relative`} // Added relative for children positioning
      onClick={(e: React.MouseEvent) => {
        if (onSelect) {
          e.stopPropagation(); // Prevent parent containers from being selected if a child is clicked
          onSelect(component.id, e.shiftKey);
        }
      }}
      // Add data attribute for easier identification in drag logic if needed
      data-component-id={component.id}
      data-component-type={component.type}
    >
      <div className="text-xs text-theme-text-muted pointer-events-none select-none absolute top-0 left-1 opacity-50">{component.name}</div>
      {isContainer && childComponents.length === 0 && !isDroppableOver && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-theme-text-muted pointer-events-none select-none">
          Drop here
        </div>
      )}
      {isContainer && isDroppableOver && (
         <div className="absolute inset-0 flex items-center justify-center text-xs text-theme-accent-secondary pointer-events-none select-none bg-theme-accent-secondary/10">
          Drop into {component.name}
        </div>
      )}
      {childComponents.map(child => (
        <DraggableCanvasItem
          key={child.id}
          component={child}
          allCanvasComponents={allCanvasComponents}
          isSelected={selectedComponentIds.includes(child.id)}
          onSelect={onSelect}
          zoomLevel={zoomLevel}
          selectedComponentIds={selectedComponentIds}
        />
      ))}
    </div>
  );
};

interface BuilderCanvasProps {
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
  onDragEnd: (event: DragEndEvent) => void; 
  onDragOver?: (event: DragOverEvent) => void; 
  onDragStart?: (event: DragStartEvent) => void;
  smartGuidesToRender?: Array<{ type: 'x' | 'y'; position: number; start: number; end: number }>;
  marqueeRect?: { x: number; y: number; width: number; height: number } | null; 
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  canvasComponents,
  selectedComponentIds,
  setSelectedComponentIds,
  zoomLevel,
  canvasOffset,
  setCanvasOffset, 
  isGridVisible,
  gridSize,
  smartGuidesToRender,
  marqueeRect, 
}) => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [particleStyles, setParticleStyles] = useState<CSSProperties[]>([]);

  useEffect(() => {
    const styles: CSSProperties[] = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setParticleStyles(styles);
  }, []);

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable-area',
  });

  const handleSelectComponent = (id: string, isShiftPressed: boolean) => {
    setSelectedComponentIds(prevSelectedIds => {
      if (isShiftPressed) {
        return prevSelectedIds.includes(id)
          ? prevSelectedIds.filter(selectedId => selectedId !== id)
          : [...prevSelectedIds, id];
      }
      return (prevSelectedIds.length === 1 && prevSelectedIds[0] === id) ? [] : [id];
    });
  };

  const deselectComponents = useCallback(() => {
    setSelectedComponentIds([]);
  }, [setSelectedComponentIds]);
  
  // Mouse down on the main canvas wrapper, not the device content, for marquee.
  // Pan is handled by the device content area's mousedown.
  const handleWrapperMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // This event is now handled by page.tsx for marquee
  };


  const deviceContentStyle: CSSProperties = {
    transform: `scale(${zoomLevel}) translate(${canvasOffset.x / zoomLevel}px, ${canvasOffset.y / zoomLevel}px)`,
    transformOrigin: 'top left',
    width: '100%', 
    height: '100%',
    position: 'relative',
    backgroundColor: isOver ? 'rgba(var(--theme-accent-primary-rgb, 0, 212, 255),0.05)' : 'transparent', // Added fallback
  };
  
  // Pan handlers for the device content area
  const handleDeviceContentMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent pan if clicking on a draggable item or if marquee is active
    if ((e.target as HTMLElement).closest('[role="button"], [data-dndkit-draggable]') || marqueeRect) {
      return;
    }
    deselectComponents();
    setIsPanning(true);
    // Pan start relative to the current canvasOffset and zoom
    setPanStart({ 
      x: e.clientX / zoomLevel - canvasOffset.x / zoomLevel, 
      y: e.clientY / zoomLevel - canvasOffset.y / zoomLevel 
    });
    (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
  };

  const handleDeviceContentMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setCanvasOffset({
        x: (e.clientX / zoomLevel - panStart.x) * zoomLevel,
        y: (e.clientY / zoomLevel - panStart.y) * zoomLevel,
      });
    }
  };

  const handleDeviceContentMouseUpOrLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setIsPanning(false);
      (e.currentTarget as HTMLElement).style.cursor = 'grab';
    }
  };


  return (
    <div 
      ref={canvasWrapperRef} // This ref is for page.tsx to get canvasRect for marquee
      className="flex-1 bg-theme-bg-primary relative overflow-hidden"
      // Mouse down for marquee is handled by page.tsx on this wrapper
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5 opacity-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)
          `
        }}></div>
        {particleStyles.map((style, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-theme-accent-primary rounded-full opacity-20 animate-float"
            style={style}
          />
        ))}
      </div>

      {/* Main Canvas Content - Centered with Device Frame */}
      <div className="h-full flex items-center justify-center p-8 overflow-auto"> {/* This div should not be droppable if marquee is on canvasWrapperRef */}
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-50"></div>
          <div className="relative bg-theme-bg-secondary rounded-2xl p-2 sm:p-4 md:p-6 shadow-2xl border border-theme-border-primary">
            <div className="bg-black rounded-lg p-1">
              <div className="bg-white rounded-md sm:rounded-lg overflow-hidden">
                <div className="h-8 sm:h-10 bg-gray-100 border-b border-gray-200 flex items-center px-2 sm:px-4">
                  <div className="flex space-x-1.5 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 flex justify-center px-2">
                    <div className="bg-white rounded-md px-2 sm:px-4 py-0.5 sm:py-1 text-xs text-gray-600 border border-gray-300 min-w-[150px] sm:min-w-[200px] text-center truncate">
                      preview.example.com
                    </div>
                  </div>
                </div>
                
                <div 
                  ref={setDroppableNodeRef} 
                  data-droppable-id="canvas-droppable-area"
                  className="w-[1200px] h-[800px] bg-white relative overflow-hidden cursor-grab" 
                  style={deviceContentStyle} 
                  onMouseDown={handleDeviceContentMouseDown}
                  onMouseMove={handleDeviceContentMouseMove}
                  onMouseUp={handleDeviceContentMouseUpOrLeave}
                  onMouseLeave={handleDeviceContentMouseUpOrLeave}
                >
                  {isGridVisible && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundSize: `${gridSize}px ${gridSize}px`,
                        backgroundImage: `
                          linear-gradient(to right, rgba(var(--theme-accent-primary-rgb, 0, 212, 255), 0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(var(--theme-accent-primary-rgb, 0, 212, 255), 0.05) 1px, transparent 1px)
                        `,
                      }}
                    />
                  )}
                  
                  {smartGuidesToRender && smartGuidesToRender.map((guide, index) => (
                    <div
                      key={`guide-${index}`}
                      className="absolute bg-theme-accent-secondary pointer-events-none"
                      style={
                        guide.type === 'x'
                          ? { left: guide.position, top: guide.start, width: '1px', height: (guide.end - guide.start) }
                          : { top: guide.position, left: guide.start, height: '1px', width: (guide.end - guide.start) }
                      }
                    />
                  ))}

                  {marqueeRect && (
                    <div
                      className="absolute border-2 border-dashed border-theme-accent-primary pointer-events-none"
                      style={{
                        left: marqueeRect.x,
                        top: marqueeRect.y,
                        width: marqueeRect.width,
                        height: marqueeRect.height,
                        // Marquee is in viewport coordinates relative to canvasWrapperRef,
                        // but rendered inside the scaled/panned deviceContent.
                        // This needs adjustment if marquee is to align with logical canvas.
                        // For now, it's a visual viewport-based marquee.
                      }}
                    />
                  )}

                  {canvasComponents.length === 0 && !marqueeRect && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center p-10">
                              <div className="w-16 h-16 bg-theme-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                  <div className="w-10 h-10 bg-gradient-to-br from-theme-accent-primary to-purple-600 rounded-xl flex items-center justify-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                  </div>
                              </div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">Start Creating</h3>
                              <p className="text-gray-500 mb-6 max-w-sm">
                                  Drag components from the left panel to begin.
                              </p>
                          </div>
                      </div>
                  )}

                  {canvasComponents.filter(c => !c.parentId).map((component) => ( // Only render top-level components
                    <DraggableCanvasItem
                      key={component.id}
                      component={component}
                      allCanvasComponents={canvasComponents} // Pass all components
                      isSelected={selectedComponentIds.includes(component.id)}
                      onSelect={handleSelectComponent}
                      zoomLevel={zoomLevel}
                      selectedComponentIds={selectedComponentIds} // Pass selected IDs
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-1 bg-gray-700 rounded-b-lg mt-1"></div>
          </div>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="bg-theme-bg-tertiary/90 backdrop-blur-sm border border-theme-border-primary rounded-lg px-3 py-1">
              <span className="text-xs text-theme-text-secondary">Desktop Preview • 1200px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderCanvas;
