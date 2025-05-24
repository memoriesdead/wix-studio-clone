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
  Active,
  Over,
  // DragOverlay, // Uncomment if you want to use DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useId } from 'react'; // Import useId from React

import TopToolbar from '@/components/builder/TopToolbar';
import ComponentPalette from '@/components/builder/ComponentPalette';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import PropertiesPanel from '@/components/builder/PropertiesPanel';
import ProfessionalStatusBar from '@/components/builder/StatusBar'; 
import { CanvasComponentInstance, DndDragItem, PaletteItem, BuilderComponentType } from '@/lib/types'; 

const BuilderPageContent: React.FC = () => {
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
  const dndLiveRegionId = useId(); // Generate a stable ID for the live region


  const updateHistory = useCallback((newCanvasState: CanvasComponentInstance[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCanvasState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

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
          updateHistory(projectData.canvasComponents);
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
  }, [updateHistory]);

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
            isPaletteItem: false,
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
            isPaletteItem: false,
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
    // handleLoadLocal(); 
  }, [handleLoadLocal]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.25));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setCanvasOffset({ x: 0, y: 0 });
  };
  const handleToggleGrid = () => setIsGridVisible(prev => !prev);

  const handlePublish = useCallback(async () => {
    try {
      const projectData = { components: canvasComponents /*, other project details */ };
      const response = await fetch('/api/deploy/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Deployment started (simulated): ${result.deploymentUrl}`);
        // TODO: Update UI with deployment status, e.g., in StatusBar
      } else {
        throw new Error(result.message || 'Deployment failed');
      }
    } catch (error) {
      console.error("Error publishing:", error);
      alert(`Error publishing: ${(error as Error).message}`);
    }
  }, [canvasComponents]);

  const handleCanvasWrapperMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only start marquee if not dragging a component and clicking on the canvas wrapper itself
    // or the direct child that is the styled canvas background, but not on an actual component.
    const target = event.target as HTMLElement;
    if (
      !isDraggingComponent && // Check if a DND operation is already in progress
      (target === canvasWrapperRef.current || 
       target === canvasWrapperRef.current?.querySelector('[data-droppable-id="canvas-droppable-area"]'))
    ) {
      if (!event.shiftKey) {
        setSelectedComponentIds([]);
      }
      const canvasRect = canvasWrapperRef.current?.getBoundingClientRect();
      if (canvasRect) {
        // Store coordinates relative to the viewport, as marqueeRect will be positioned absolutely
        marqueeStartPoint.current = {
          x: event.clientX,
          y: event.clientY,
        };
        // Initial marquee is a point, relative to canvasWrapperRef for rendering
        setMarqueeRect({ 
          x: event.clientX - canvasRect.left, 
          y: event.clientY - canvasRect.top, 
          width: 0, 
          height: 0 
        });
        event.stopPropagation(); // Prevent canvas pan if starting marquee
      }
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
      
      // Marquee coordinates relative to the viewport
      const marqueeViewportX1 = Math.min(marqueeStartPoint.current.x, event.clientX);
      const marqueeViewportY1 = Math.min(marqueeStartPoint.current.y, event.clientY);
      const marqueeViewportX2 = Math.max(marqueeStartPoint.current.x, event.clientX);
      const marqueeViewportY2 = Math.max(marqueeStartPoint.current.y, event.clientY);

      const newSelectedIds = canvasComponents.filter(comp => {
        // Component's viewport coordinates
        const compViewportLeft = (comp.left * zoomLevel) + canvasOffset.x + canvasRect.left;
        const compViewportTop = (comp.top * zoomLevel) + canvasOffset.y + canvasRect.top;
        const compViewportRight = compViewportLeft + (comp.width * zoomLevel);
        const compViewportBottom = compViewportTop + (comp.height * zoomLevel);

        // Intersection check in viewport coordinates
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
    if (!over || !active.data.current || over.id !== 'canvas-droppable-area') {
      setSmartGuides([]);
      return;
    }

    const activeData = active.data.current as DndDragItem;
    const activeNode = document.getElementById(active.id as string); // Get the actual dragging element
    const activeRect = activeNode?.getBoundingClientRect(); // Use getBoundingClientRect for viewport coords


    if (!activeRect || !activeData.width || !activeData.height || !canvasWrapperRef.current) {
      setSmartGuides([]);
      return;
    }
    
    const canvasRect = canvasWrapperRef.current.getBoundingClientRect();
    const guides: Array<{ type: 'x' | 'y'; position: number; start: number; end: number }> = [];
    const snapThreshold = 5; // Snap threshold in viewport pixels

    // Current viewport position of the dragging item's top-left corner
    // active.rect.current.translated might not be updated if DragOverlay is used or with certain sensor setups.
    // Using getBoundingClientRect of the source node is more reliable if available.
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
      if (comp.id === activeData.id || (activeData.isPaletteItem && comp.id === activeData.initialData.id)) return;

      // Component's viewport coordinates
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

      // X-axis (Vertical Guides) - Compare viewport coordinates
      const xTargets = [compEdgesViewport.left, compEdgesViewport.centerX, compEdgesViewport.right];
      const xDrag = [dragEdgesViewport.left, dragEdgesViewport.centerX, dragEdgesViewport.right];
      
      xTargets.forEach(targetX => {
        xDrag.forEach(dragX => {
          if (Math.abs(dragX - targetX) < snapThreshold) {
            const guideYStart = (Math.min(dragEdgesViewport.top, compEdgesViewport.top) - canvasRect.top) / zoomLevel - (canvasOffset.y / zoomLevel);
            const guideYEnd = (Math.max(dragEdgesViewport.bottom, compEdgesViewport.bottom) - canvasRect.top) / zoomLevel - (canvasOffset.y / zoomLevel);
            guides.push({ type: 'x', position: (targetX - canvasRect.left - canvasOffset.x) / zoomLevel, start: guideYStart, end: guideYEnd });
          }
        });
      });

      // Y-axis (Horizontal Guides) - Compare viewport coordinates
      const yTargets = [compEdgesViewport.top, compEdgesViewport.centerY, compEdgesViewport.bottom];
      const yDrag = [dragEdgesViewport.top, dragEdgesViewport.centerY, dragEdgesViewport.bottom];

      yTargets.forEach(targetY => {
        yDrag.forEach(dragY => {
          if (Math.abs(dragY - targetY) < snapThreshold) {
            const guideXStart = (Math.min(dragEdgesViewport.left, compEdgesViewport.left) - canvasRect.left) / zoomLevel - (canvasOffset.x / zoomLevel);
            const guideXEnd = (Math.max(dragEdgesViewport.right, compEdgesViewport.right) - canvasRect.left) / zoomLevel - (canvasOffset.x / zoomLevel);
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
    // setSmartGuides([]); // Clear guides on drag end, already done in DragOver if no valid target

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
          // Fallback, less accurate
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
          parentId: parentId, // Set parentId
        };
        newComponentsState = [...canvasComponents, newComponent];
        newSelectedId = newComponent.id;

      } else { // Existing component dragged
        const existingComponent = dragItemData.initialData as CanvasComponentInstance;
        let newLogicalX_canvas = existingComponent.left + (delta.x / zoomLevel);
        let newLogicalY_canvas = existingComponent.top + (delta.y / zoomLevel);
        
        // If the component already had a parent, its current left/top are relative to that parent.
        // We need to convert them to absolute canvas coordinates first.
        if (existingComponent.parentId) {
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
        
        // Snap to guides (guides are currently canvas-relative, need adjustment for container-relative snapping if parentContainer)
        // For now, simplify snapping to grid for relative coords
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
    setSmartGuides([]); // Clear guides after drop
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver} 
      onDragEnd={handleDragEnd} 
      collisionDetection={closestCenter}
      id={dndLiveRegionId} // Provide a static ID to DndContext
    >
      <div 
        className="flex flex-col h-screen bg-theme-bg-primary text-theme-text-primary" // Applied theme colors
        onMouseDown={handleCanvasWrapperMouseDown} // For marquee selection
        onMouseMove={handleCanvasWrapperMouseMove}
        onMouseUp={handleCanvasWrapperMouseUp}
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
        />
        <div className="flex flex-1 overflow-hidden" ref={canvasWrapperRef} >
          <ComponentPalette />
          <BuilderCanvas
            canvasComponents={canvasComponents}
            setCanvasComponents={setCanvasComponents} // Still needed for direct manipulations like delete
            selectedComponentIds={selectedComponentIds}
            setSelectedComponentIds={setSelectedComponentIds}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            canvasOffset={canvasOffset}
            setCanvasOffset={setCanvasOffset}
            isGridVisible={isGridVisible}
            gridSize={gridSize}
            updateHistory={updateHistory} 
            onDragEnd={handleDragEnd} 
            smartGuidesToRender={smartGuides}
            marqueeRect={marqueeRect} 
          />
          <PropertiesPanel selectedComponent={canvasComponents.find(c => c.id === selectedComponentIds[0])} />
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

export default function BuilderPage() {
  return <BuilderPageContent />;
}
