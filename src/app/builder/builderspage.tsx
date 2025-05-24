"use client";

import React, { useState, useCallback, useRef, CSSProperties, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  // Active, // Not used directly, can be removed if not needed by DndContext indirectly
  // Over,   // Not used directly
  // DragOverlay, // Uncomment if you want to use DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useId } from 'react';

import TopToolbar from '@/components/builder/TopToolbar';
import Prototies from '@/components/builder/Prototies'; // Updated import
import Buildemiddlepageui from '@/components/builder/Buildemiddlepageui'; // Updated import
import ProfessionalStatusBar from '@/components/builder/StatusBar';
import { CanvasComponentInstance, DndDragItem, PaletteItem, BuilderComponentType, ResponsiveStyles } from '@/lib/types';

const BuildersPage: React.FC = () => {
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponentInstance[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isGridVisible, setIsGridVisible] = useState(true);
  const gridSize = 8;
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<Omit<CanvasComponentInstance, 'id' | 'left' | 'top'>[]>([]);
  const [history, setHistory] = useState<CanvasComponentInstance[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeDragItem, setActiveDragItem] = useState<DndDragItem | null>(null);
  const [smartGuides, setSmartGuides] = useState<Array<{ type: 'x' | 'y'; position: number; start: number; end: number }>>([]);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [marqueeRect, setMarqueeRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const marqueeStartPoint = useRef<{ x: number; y: number } | null>(null);
  const [isDraggingComponent, setIsDraggingComponent] = useState(false);
  const dndLiveRegionId = useId();
  const [activeCanvasBreakpoint, setActiveCanvasBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const updateHistory = useCallback((newCanvasState: CanvasComponentInstance[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCanvasState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUpdateProperty = useCallback((
    componentId: string,
    propertyPath: string,
    value: unknown, // Changed from any to unknown
    breakpoint?: keyof ResponsiveStyles
  ) => {
    setCanvasComponents(prevComponents => {
      const newComponents = prevComponents.map(comp => {
        if (comp.id === componentId) {
          const updatedComp = JSON.parse(JSON.stringify(comp));
          const parts = propertyPath.split('.');
          let currentLevel = updatedComp;
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!currentLevel[part] || typeof currentLevel[part] !== 'object') {
              if (part === 'responsiveStyles' && breakpoint && parts[i+1] === breakpoint) {
                currentLevel.responsiveStyles = { ...currentLevel.responsiveStyles };
                currentLevel.responsiveStyles[breakpoint] = { ...(currentLevel.responsiveStyles[breakpoint] || {}) };
              } else {
                currentLevel[part] = {};
              }
            }
            currentLevel = currentLevel[part];
          }
          currentLevel[parts[parts.length - 1]] = value;
          return updatedComp;
        }
        return comp;
      });
      updateHistory(newComponents); // updateHistory is now defined before this
      return newComponents;
    });
  }, [history, historyIndex, updateHistory]); // Added updateHistory to dependency array

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevHistoryIndex = historyIndex - 1;
      setHistoryIndex(prevHistoryIndex);
      setCanvasComponents(history[prevHistoryIndex]);
      setSelectedComponentIds([]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextHistoryIndex = historyIndex + 1;
      setHistoryIndex(nextHistoryIndex);
      setCanvasComponents(history[nextHistoryIndex]);
      setSelectedComponentIds([]);
    }
  }, [history, historyIndex]);

  const handleSaveLocal = useCallback(() => {
    try {
      const dataToSave = { canvasComponents };
      localStorage.setItem('websiteBuilderProject', JSON.stringify(dataToSave));
      alert('Project saved locally!');
    } catch (err) {
      console.error("Failed to save project locally:", err);
      alert('Error saving project locally.');
    }
  }, [canvasComponents]);

  const handleLoadLocal = useCallback(() => {
    try {
      const savedData = localStorage.getItem('websiteBuilderProject');
      if (savedData) {
        const projectData = JSON.parse(savedData);
        if (projectData.canvasComponents) {
          setCanvasComponents(projectData.canvasComponents);
          updateHistory(projectData.canvasComponents); // Ensure history is updated
          setSelectedComponentIds([]);
          alert('Project loaded locally!');
        }
      } else {
        alert('No local project found.');
      }
    } catch (err) {
      console.error("Failed to load project locally:", err);
      alert('Error loading project locally.');
    }
  }, [updateHistory]); // updateHistory as dependency

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const targetElement = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetElement.tagName) || targetElement.isContentEditable) {
        return;
      }
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlCmd = isMac ? event.metaKey : event.ctrlKey;

      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedComponentIds.length > 0) {
        event.preventDefault();
        const newState = canvasComponents.filter(comp => !selectedComponentIds.includes(comp.id));
        setCanvasComponents(newState);
        updateHistory(newState);
        setSelectedComponentIds([]);
      } else if (ctrlCmd && event.key === 'c' && selectedComponentIds.length > 0) {
        event.preventDefault();
        const copied = canvasComponents
          .filter(comp => selectedComponentIds.includes(comp.id))
          .map(({ id, left, top, ...rest }) => rest);
        setClipboard(copied as Omit<CanvasComponentInstance, 'id' | 'left' | 'top'>[]);
      } else if (ctrlCmd && event.key === 'v' && clipboard.length > 0) {
        event.preventDefault();
        const pasted = clipboard.map(copiedComp => {
          const newId = `${copiedComp.type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
          return {
            ...copiedComp,
            id: newId,
            left: gridSize * 2 + Math.floor(Math.random() * 5) * gridSize,
            top: gridSize * 2 + Math.floor(Math.random() * 5) * gridSize,
            isPaletteItem: false, // Important for new components
            responsiveStyles: {}, // Initialize
          } as CanvasComponentInstance;
        });
        const newState = [...canvasComponents, ...pasted];
        setCanvasComponents(newState);
        updateHistory(newState);
        setSelectedComponentIds(pasted.map(nc => nc.id));
      } else if (ctrlCmd && event.key === 'd' && selectedComponentIds.length > 0) {
        event.preventDefault();
        const duplicated = canvasComponents
          .filter(comp => selectedComponentIds.includes(comp.id))
          .map(compToDuplicate => {
            const { id, left, top, ...rest } = compToDuplicate;
            const newId = `${rest.type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            return {
              ...rest,
              id: newId,
              left: (left || 0) + gridSize * 2,
              top: (top || 0) + gridSize * 2,
              isPaletteItem: false, // Important for new components
              responsiveStyles: { ...(compToDuplicate.responsiveStyles || {}) }, // Copy responsive styles
            } as CanvasComponentInstance;
          });
        const newState = [...canvasComponents, ...duplicated];
        setCanvasComponents(newState);
        updateHistory(newState);
        setSelectedComponentIds(duplicated.map(dc => dc.id));
      } else if (ctrlCmd && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      } else if (ctrlCmd && (event.key === 'y' || (isMac && event.shiftKey && event.key === 'z'))) {
        event.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentIds, canvasComponents, clipboard, gridSize, history, historyIndex, handleUndo, handleRedo, updateHistory]);

  useEffect(() => {
    // handleLoadLocal(); // Optionally load on mount
  }, [handleLoadLocal]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.25));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setCanvasOffset({ x: 0, y: 0 });
  };
  // const handleToggleGrid = () => setIsGridVisible(prev => !prev); // This state is now passed to Buildemiddlepageui

  const handlePublish = useCallback(async () => {
    try {
      const projectData = { components: canvasComponents };
      const response = await fetch('/api/deploy/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Deployment started (simulated): ${result.deploymentUrl}`);
      } else {
        throw new Error(result.message || 'Deployment failed');
      }
    } catch (error) {
      console.error("Error publishing:", error);
      alert(`Error publishing: ${(error as Error).message}`);
    }
  }, [canvasComponents]);

  const handleCanvasWrapperMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isDirectCanvasClick = target === canvasWrapperRef.current || 
                               target.closest('[data-droppable-id="canvas-droppable-area"]') !== null;
    const isComponentClick = target.closest('[data-draggable-id]') !== null;


    if (!isDraggingComponent && isDirectCanvasClick && !isComponentClick) {
        if (!event.shiftKey) {
            setSelectedComponentIds([]);
        }
        const canvasRect = canvasWrapperRef.current?.getBoundingClientRect();
        if (canvasRect) {
            marqueeStartPoint.current = { x: event.clientX, y: event.clientY };
            setMarqueeRect({
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top,
                width: 0,
                height: 0
            });
            // event.stopPropagation(); // Consider if this is needed
        }
    } else if (!isComponentClick && !event.shiftKey) { // Click on empty area outside components
        setSelectedComponentIds([]);
    }
  };

  const handleCanvasWrapperMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (marqueeStartPoint.current && canvasWrapperRef.current) {
      const canvasRect = canvasWrapperRef.current.getBoundingClientRect();
      const currentX = event.clientX;
      const currentY = event.clientY;
      const x = Math.min(marqueeStartPoint.current.x, currentX) - canvasRect.left;
      const y = Math.min(marqueeStartPoint.current.y, currentY) - canvasRect.top;
      const width = Math.abs(currentX - marqueeStartPoint.current.x);
      const height = Math.abs(currentY - marqueeStartPoint.current.y);
      setMarqueeRect({ x, y, width, height });
    }
  };

  const handleCanvasWrapperMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (marqueeStartPoint.current && marqueeRect && canvasWrapperRef.current) {
      const canvasRect = canvasWrapperRef.current.getBoundingClientRect();
      const marqueeViewportX1 = Math.min(marqueeStartPoint.current.x, event.clientX);
      const marqueeViewportY1 = Math.min(marqueeStartPoint.current.y, event.clientY);
      const marqueeViewportX2 = Math.max(marqueeStartPoint.current.x, event.clientX);
      const marqueeViewportY2 = Math.max(marqueeStartPoint.current.y, event.clientY);

      const newSelectedIds = canvasComponents.filter(comp => {
        const compViewportLeft = (comp.left * zoomLevel) + canvasOffset.x + canvasRect.left;
        const compViewportTop = (comp.top * zoomLevel) + canvasOffset.y + canvasRect.top;
        const compViewportRight = compViewportLeft + (comp.width * zoomLevel);
        const compViewportBottom = compViewportTop + (comp.height * zoomLevel);
        return (
          compViewportLeft < marqueeViewportX2 &&
          compViewportRight > marqueeViewportX1 &&
          compViewportTop < marqueeViewportY2 &&
          compViewportBottom > marqueeViewportY1
        );
      }).map(comp => comp.id);

      if (event.shiftKey) {
        setSelectedComponentIds(prev => [...new Set([...prev, ...newSelectedIds])]);
      } else {
        setSelectedComponentIds(newSelectedIds);
      }
    }
    marqueeStartPoint.current = null;
    setMarqueeRect(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setIsDraggingComponent(true);
    if (active.data.current) {
      setActiveDragItem(active.data.current as DndDragItem);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active.data.current || !canvasWrapperRef.current) {
      setSmartGuides([]);
      return;
    }
     // Only calculate guides if over the canvas area or a container within it
    const overId = over.id as string;
    if (overId !== 'canvas-droppable-area' && !overId.startsWith('container-drop-')) {
        setSmartGuides([]);
        return;
    }


    const activeData = active.data.current as DndDragItem;
    const activeNode = document.getElementById(active.id as string);
    const activeRect = activeNode?.getBoundingClientRect();

    if (!activeRect || !activeData.width || !activeData.height) {
      setSmartGuides([]);
      return;
    }

    const canvasRect = canvasWrapperRef.current.getBoundingClientRect();
    const guides: Array<{ type: 'x' | 'y'; position: number; start: number; end: number }> = [];
    const snapThreshold = 5;
    const currentViewportX = activeRect.left;
    const currentViewportY = activeRect.top;
    const dragItemViewportWidth = activeRect.width;
    const dragItemViewportHeight = activeRect.height;

    const dragEdgesViewport = {
      left: currentViewportX,
      right: currentViewportX + dragItemViewportWidth,
      top: currentViewportY,
      bottom: currentViewportY + dragItemViewportHeight,
      centerX: currentViewportX + dragItemViewportWidth / 2,
      centerY: currentViewportY + dragItemViewportHeight / 2,
    };

    canvasComponents.forEach(comp => {
      if (comp.id === activeData.id || (activeData.isPaletteItem && comp.id === (activeData.initialData as PaletteItem).id)) return;

      const compViewportLeft = (comp.left * zoomLevel) + canvasOffset.x + canvasRect.left;
      const compViewportTop = (comp.top * zoomLevel) + canvasOffset.y + canvasRect.top;
      const compViewportRight = compViewportLeft + (comp.width * zoomLevel);
      const compViewportBottom = compViewportTop + (comp.height * zoomLevel);
      const compViewportCenterX = compViewportLeft + (comp.width * zoomLevel) / 2;
      const compViewportCenterY = compViewportTop + (comp.height * zoomLevel) / 2;

      const compEdgesViewport = {
        left: compViewportLeft,
        right: compViewportRight,
        top: compViewportTop,
        bottom: compViewportBottom,
        centerX: compViewportCenterX,
        centerY: compViewportCenterY,
      };

      const xTargets = [compEdgesViewport.left, compEdgesViewport.centerX, compEdgesViewport.right];
      const xDrag = [dragEdgesViewport.left, dragEdgesViewport.centerX, dragEdgesViewport.right];
      xTargets.forEach(targetX => {
        xDrag.forEach(dragX => {
          if (Math.abs(dragX - targetX) < snapThreshold) {
            const guideYStart = (Math.min(dragEdgesViewport.top, compEdgesViewport.top) - canvasRect.top - canvasOffset.y) / zoomLevel;
            const guideYEnd = (Math.max(dragEdgesViewport.bottom, compEdgesViewport.bottom) - canvasRect.top - canvasOffset.y) / zoomLevel;
            guides.push({ type: 'x', position: (targetX - canvasRect.left - canvasOffset.x) / zoomLevel, start: guideYStart, end: guideYEnd });
          }
        });
      });

      const yTargets = [compEdgesViewport.top, compEdgesViewport.centerY, compEdgesViewport.bottom];
      const yDrag = [dragEdgesViewport.top, dragEdgesViewport.centerY, dragEdgesViewport.bottom];
      yTargets.forEach(targetY => {
        yDrag.forEach(dragY => {
          if (Math.abs(dragY - targetY) < snapThreshold) {
            const guideXStart = (Math.min(dragEdgesViewport.left, compEdgesViewport.left) - canvasRect.left - canvasOffset.x) / zoomLevel;
            const guideXEnd = (Math.max(dragEdgesViewport.right, compEdgesViewport.right) - canvasRect.left - canvasOffset.x) / zoomLevel;
            guides.push({ type: 'y', position: (targetY - canvasRect.top - canvasOffset.y) / zoomLevel, start: guideXStart, end: guideXEnd });
          }
        });
      });
    });
    setSmartGuides(guides);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveDragItem(null);
    setIsDraggingComponent(false);
    setSmartGuides([]);

    if (!over || !active.data.current) return;

    const dragItemData = active.data.current as DndDragItem;
    let newComponentsState: CanvasComponentInstance[] = [...canvasComponents];
    let newSelectedId: string | null = null;
    const overId = over.id as string;
    const isDroppingOnCanvas = overId === 'canvas-droppable-area';
    const isDroppingOnContainer = overId.startsWith('container-drop-');
    let parentId: string | null = null;
    let parentContainer: CanvasComponentInstance | null = null;

    if (isDroppingOnContainer) {
      parentId = overId.replace('container-drop-', '');
      parentContainer = canvasComponents.find(c => c.id === parentId) || null;
    }

    if (isDroppingOnCanvas || parentContainer) {
      if (dragItemData.isPaletteItem) {
        const paletteItem = dragItemData.initialData as PaletteItem;
        const activeNode = document.getElementById(active.id as string);
        const activeRect = activeNode?.getBoundingClientRect();
        let dropLogicalX_canvas = 0;
        let dropLogicalY_canvas = 0;

        if (canvasWrapperRef.current && activeRect) {
          const canvasRect = canvasWrapperRef.current.getBoundingClientRect();
          dropLogicalX_canvas = (activeRect.left - canvasRect.left - canvasOffset.x) / zoomLevel;
          dropLogicalY_canvas = (activeRect.top - canvasRect.top - canvasOffset.y) / zoomLevel;
        } else {
          dropLogicalX_canvas = (delta.x - canvasOffset.x) / zoomLevel;
          dropLogicalY_canvas = (delta.y - canvasOffset.y) / zoomLevel;
        }

        let newLeft = dropLogicalX_canvas;
        let newTop = dropLogicalY_canvas;

        if (parentContainer) {
          newLeft -= parentContainer.left;
          newTop -= parentContainer.top;
        }
        
        newLeft = Math.round(newLeft / gridSize) * gridSize;
        newTop = Math.round(newTop / gridSize) * gridSize;

        const newComponent: CanvasComponentInstance = {
          id: `${paletteItem.type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: paletteItem.type,
          name: paletteItem.name,
          isPaletteItem: false,
          left: newLeft,
          top: newTop,
          width: typeof paletteItem.defaultWidth === 'number' ? paletteItem.defaultWidth : (parseInt(String(paletteItem.defaultWidth)) || 150),
          height: typeof paletteItem.defaultHeight === 'number' ? paletteItem.defaultHeight : (parseInt(String(paletteItem.defaultHeight)) || 50),
          props: paletteItem.defaultProps || {},
          style: (paletteItem.defaultProps?.style as CSSProperties) || {},
          responsiveStyles: {},
          parentId: parentId,
        };
        newComponentsState = [...canvasComponents, newComponent];
        newSelectedId = newComponent.id;
      } else {
        const existingComponent = dragItemData.initialData as CanvasComponentInstance;
        let newLogicalX_canvas = existingComponent.left + (delta.x / zoomLevel);
        let newLogicalY_canvas = existingComponent.top + (delta.y / zoomLevel);

        if (existingComponent.parentId && !parentContainer) { // Dragged out of a container
            const originalParent = canvasComponents.find(c => c.id === existingComponent.parentId);
            if (originalParent) {
                newLogicalX_canvas = originalParent.left + existingComponent.left + (delta.x / zoomLevel);
                newLogicalY_canvas = originalParent.top + existingComponent.top + (delta.y / zoomLevel);
            }
        } else if (!existingComponent.parentId && parentContainer) { // Dragged into a container
             // Coordinates are already canvas-relative from delta, adjust for new parent
        } else if (existingComponent.parentId && parentContainer && existingComponent.parentId !== parentContainer.id) { // Dragged from one container to another
            const originalParent = canvasComponents.find(c => c.id === existingComponent.parentId);
             if (originalParent) {
                newLogicalX_canvas = originalParent.left + existingComponent.left + (delta.x / zoomLevel);
                newLogicalY_canvas = originalParent.top + existingComponent.top + (delta.y / zoomLevel);
            }
        }


        let newLeft = newLogicalX_canvas;
        let newTop = newLogicalY_canvas;

        if (parentContainer) {
          newLeft -= parentContainer.left;
          newTop -= parentContainer.top;
        }
        
        newLeft = Math.round(newLeft / gridSize) * gridSize;
        newTop = Math.round(newTop / gridSize) * gridSize;

        newComponentsState = canvasComponents.map(comp =>
          comp.id === active.id ? { ...comp, left: newLeft, top: newTop, parentId: parentId } : comp
        );
        newSelectedId = active.id as string;
      }
      setCanvasComponents(newComponentsState);
      if (newSelectedId) {
        setSelectedComponentIds([newSelectedId]);
      }
      updateHistory(newComponentsState);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      id={dndLiveRegionId}
    >
      <div
        className="flex flex-col flex-1 bg-theme-bg-primary text-theme-text-primary"
        onMouseDown={handleCanvasWrapperMouseDown}
        onMouseMove={handleCanvasWrapperMouseMove}
        onMouseUp={handleCanvasWrapperMouseUp}
        ref={canvasWrapperRef} // Assign ref here for marquee selection context
      >
        <TopToolbar
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          zoomLevel={zoomLevel}
          onSave={handleSaveLocal}
          onPublish={handlePublish}
          currentDevice={activeCanvasBreakpoint}
          onSetDevice={setActiveCanvasBreakpoint}
        />
        <div className="flex flex-1 relative">
          <Prototies />
          <Buildemiddlepageui
            activeBreakpoint={activeCanvasBreakpoint}
            canvasComponents={canvasComponents}
            setCanvasComponents={setCanvasComponents}
            selectedComponentIds={selectedComponentIds}
            setSelectedComponentIds={setSelectedComponentIds}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            canvasOffset={canvasOffset}
            setCanvasOffset={setCanvasOffset}
            isGridVisible={isGridVisible}
            gridSize={gridSize}
            updateHistory={updateHistory}
            smartGuidesToRender={smartGuides}
            marqueeRect={marqueeRect}
            onUpdateProperty={handleUpdateProperty}
          />
        </div>
        <ProfessionalStatusBar
          componentCount={canvasComponents.length}
          selectedComponentName={selectedComponentIds.length === 1 ? canvasComponents.find(c => c.id === selectedComponentIds[0])?.name : null}
          currentZoomLevel={zoomLevel}
        />
      </div>
    </DndContext>
  );
};

export default BuildersPage;
