"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  ChevronDown,
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  ZoomOut,
  ZoomIn,
  Save,
  Play,
  Eye,
  Settings,
  Share2,
  Crown,
  Grid3X3,
  Layers,
  Image,
  Palette,
  Upload,
  Code,
  Users,
  Globe,
  Search,
  Plus,
  MousePointer,
  Type,
  Box,
  Columns,
  Zap,
  AlignJustify,
  Copy,
  Trash2,
  Lock,
  Unlock,
  EyeOff,
  Edit3,
  MoreHorizontal,
  Star,
  Filter,
  List,
  Move,
  RotateCw,
  History,
  Download,
  Sparkles,
  HardDrive,
  Layout,
  Menu,
  X,
  Check,
  AlertCircle,
  Maximize2,
  Minimize2,
  PanelLeftOpen,
  PanelRightOpen,
  PanelLeft,
  PanelRight
} from 'lucide-react';
import { BuilderComponentType, CanvasComponentInstance, PaletteItem, DndDragItem } from '@/lib/types'; // Import all necessary types

// Enhanced types for commercial grade builder - REMOVED LOCAL DEFINITIONS
// interface CanvasComponentInstance {
//   id: string;
//   type: string;
//   name: string;
//   left: number;
//   top: number;
//   width: number;
//   height: number;
//   props: Record<string, any>;
//   style?: React.CSSProperties;
//   parentId?: string | null;
//   isLocked?: boolean;
//   isVisible?: boolean;
//   rotation?: number;
//   zIndex?: number;
//   isExpanded?: boolean;
// }

// interface PaletteItem {
//   id: string;
//   type: string;
//   name: string;
//   description: string;
//   category: string;
//   isPaletteItem: true;
//   defaultWidth: number | string;
//   defaultHeight: number | string;
//   defaultProps?: Record<string, any>;
//   icon?: React.ElementType;
//   tags?: string[];
//   isPopular?: boolean;
//   isNew?: boolean;
// }

// interface DndDragItem {
//   id: string;
//   type: string;
//   name: string;
//   isPaletteItem: boolean;
//   initialData: PaletteItem | CanvasComponentInstance;
//   width?: number;
//   height?: number;
// }

// Professional Top Toolbar Component
const ProfessionalTopToolbar: React.FC<{
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  zoomLevel: number;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
}> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoomLevel,
  onSave,
  onPreview,
  onPublish,
  deviceMode,
  onDeviceChange,
  isLeftPanelOpen,
  isRightPanelOpen,
  onToggleLeftPanel,
  onToggleRightPanel,
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSave = async () => {
    await onSave();
    setLastSaved(new Date());
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm relative z-30">
      {/* Left Section - Brand & Project */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="text-gray-800 font-semibold text-lg">WebStudio</span>
        </div>
        
        {/* Panel Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleLeftPanel}
            className={`p-2 rounded-lg transition-colors ${
              isLeftPanelOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Toggle Components Panel"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleRightPanel}
            className={`p-2 rounded-lg transition-colors ${
              isRightPanelOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Toggle Properties Panel"
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>

        {/* Project Info */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
          <div className={`w-2 h-2 rounded-full ${lastSaved ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
          <span className="text-gray-700 text-sm font-medium">My Awesome Website</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Center Section - Tools */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {/* Undo/Redo */}
        <button 
          onClick={onUndo} 
          disabled={!canUndo} 
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-all disabled:opacity-40"
          title="Undo (⌘Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button 
          onClick={onRedo} 
          disabled={!canRedo} 
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-all disabled:opacity-40"
          title="Redo (⌘⇧Z)"
        >
          <Redo className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        {/* Device Modes */}
        <button 
          onClick={() => onDeviceChange('desktop')}
          className={`p-2 rounded-md transition-all ${
            deviceMode === 'desktop' 
              ? 'text-blue-600 bg-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-white'
          }`}
          title="Desktop View"
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDeviceChange('tablet')}
          className={`p-2 rounded-md transition-all ${
            deviceMode === 'tablet' 
              ? 'text-blue-600 bg-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-white'
          }`}
          title="Tablet View"
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDeviceChange('mobile')}
          className={`p-2 rounded-md transition-all ${
            deviceMode === 'mobile' 
              ? 'text-blue-600 bg-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-white'
          }`}
          title="Mobile View"
        >
          <Smartphone className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        {/* Zoom Controls */}
        <button 
          onClick={onZoomOut} 
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-all" 
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={onResetZoom} 
          className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-all font-medium text-sm min-w-[60px]"
          title="Reset Zoom"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button 
          onClick={onZoomIn} 
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-all" 
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Save Status */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className={`w-2 h-2 rounded-full ${lastSaved ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span>{lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Unsaved changes'}</span>
        </div>

        {/* Action Buttons */}
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save
        </button>
        
        <button 
          onClick={onPreview}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Preview
        </button>
        
        <button 
          onClick={handlePublish}
          disabled={isPublishing}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-sm shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {isPublishing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
              Publishing...
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 inline mr-2" />
              Publish
            </>
          )}
        </button>
        
        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm hover:shadow-lg transition-shadow"
          >
            JD
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="font-medium text-gray-800">John Doe</div>
                <div className="text-sm text-gray-500">john@example.com</div>
              </div>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Help</button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Component Palette
const EnhancedComponentPalette: React.FC<{
  isOpen: boolean;
}> = ({ isOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const availableComponents: PaletteItem[] = [
    {
      id: 'text',
      type: BuilderComponentType.Text,
      name: 'Text',
      description: 'Add paragraphs and content',
      category: 'Basic',
      isPaletteItem: true,
      defaultWidth: 200,
      defaultHeight: 40,
      defaultProps: { text: 'Your text here...' },
      icon: Type,
      isPopular: true,
      tags: ['text', 'content', 'typography']
    },
    {
      id: 'heading',
      type: BuilderComponentType.Heading,
      name: 'Heading',
      description: 'Create titles and headings',
      category: 'Basic',
      isPaletteItem: true,
      defaultWidth: 250,
      defaultHeight: 50,
      defaultProps: { level: 'h1', text: 'Your Heading' },
      icon: Type,
      isPopular: true,
      tags: ['heading', 'title', 'typography']
    },
    {
      id: 'button',
      type: BuilderComponentType.Button,
      name: 'Button',
      description: 'Interactive call-to-action',
      category: 'Basic',
      isPaletteItem: true,
      defaultWidth: 120,
      defaultHeight: 40,
      defaultProps: { text: 'Click Me', variant: 'primary' },
      icon: MousePointer,
      isPopular: true,
      tags: ['button', 'action', 'interactive']
    },
    {
      id: 'image',
      type: BuilderComponentType.Image,
      name: 'Image',
      description: 'Add photos and graphics',
      category: 'Media',
      isPaletteItem: true,
      defaultWidth: 200,
      defaultHeight: 150,
      defaultProps: { src: '', alt: 'Image' },
      icon: Image,
      isPopular: true,
      tags: ['image', 'photo', 'visual', 'media']
    },
    {
      id: 'container',
      type: BuilderComponentType.Container,
      name: 'Container',
      description: 'Group and organize content',
      category: 'Layout',
      isPaletteItem: true,
      defaultWidth: 300,
      defaultHeight: 200,
      icon: Box,
      tags: ['container', 'wrapper', 'layout']
    },
    {
      id: 'columns',
      type: BuilderComponentType.Columns,
      name: 'Columns',
      description: 'Multi-column layouts',
      category: 'Layout',
      isPaletteItem: true,
      defaultWidth: '100%',
      defaultHeight: 200,
      defaultProps: { columns: 3 },
      icon: Columns,
      isPopular: true,
      tags: ['columns', 'grid', 'layout']
    },
    {
      id: 'icon',
      type: BuilderComponentType.Icon,
      name: 'Icon',
      description: 'Vector icons and symbols',
      category: 'Basic',
      isPaletteItem: true,
      defaultWidth: 30,
      defaultHeight: 30,
      defaultProps: { iconName: 'star' },
      icon: Zap,
      tags: ['icon', 'symbol', 'vector']
    },
    {
      id: 'divider',
      type: BuilderComponentType.Divider,
      name: 'Divider',
      description: 'Horizontal separator line',
      category: 'Basic',
      isPaletteItem: true,
      defaultWidth: '100%',
      defaultHeight: 2,
      icon: AlignJustify,
      tags: ['divider', 'separator', 'line']
    }
  ];

  const categories = [
    { id: 'All', name: 'All', count: availableComponents.length },
    { id: 'Basic', name: 'Basic', count: availableComponents.filter(c => c.category === 'Basic').length },
    { id: 'Layout', name: 'Layout', count: availableComponents.filter(c => c.category === 'Layout').length },
    { id: 'Media', name: 'Media', count: availableComponents.filter(c => c.category === 'Media').length },
  ];

  const filteredComponents = availableComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (component.description || '').toLowerCase().includes(searchTerm.toLowerCase()); // Handle optional description
    const matchesCategory = activeCategory === 'All' || component.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const DraggableComponent: React.FC<{ item: PaletteItem }> = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: `palette-${item.id}`,
      data: {
        id: item.id,
        type: item.type,
        name: item.name,
        isPaletteItem: true,
        initialData: item,
        width: typeof item.defaultWidth === 'number' ? item.defaultWidth : 150,
        height: typeof item.defaultHeight === 'number' ? item.defaultHeight : 50,
      } as DndDragItem,
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      zIndex: isDragging ? 1000 : 'auto',
      opacity: isDragging ? 0.8 : 1,
    } : {};

    const IconComponent = item.icon || Box;

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="group cursor-grab active:cursor-grabbing transform transition-all duration-200 hover:scale-105"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200 relative">
          {/* Badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            {item.isNew && (
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">New</span>
            )}
            {item.isPopular && (
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
            )}
          </div>

          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
            <IconComponent className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
            {item.name}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2">
            {item.description || `Draggable ${item.type} component`}
          </p>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            Components
          </h2>
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                activeCategory === category.id 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredComponents.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredComponents.map(item => (
              <DraggableComponent key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No components found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or category</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-xs text-gray-500">
          <span>{filteredComponents.length} components available</span>
        </div>
      </div>
    </div>
  );
};

// Enhanced Canvas with Professional Features
export const ProfessionalCanvas: React.FC<{ // Added export keyword
  canvasComponents: CanvasComponentInstance[];
  setCanvasComponents: React.Dispatch<React.SetStateAction<CanvasComponentInstance[]>>;
  selectedComponentIds: string[];
  setSelectedComponentIds: React.Dispatch<React.SetStateAction<string[]>>;
  zoomLevel: number;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  updateHistory: (newState: CanvasComponentInstance[]) => void;
}> = ({
  canvasComponents,
  setCanvasComponents,
  selectedComponentIds,
  setSelectedComponentIds,
  zoomLevel,
  canvasOffset,
  setCanvasOffset,
  deviceMode,
  updateHistory,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showRulers, setShowRulers] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable-area',
  });

  const getDeviceSize = () => {
    switch (deviceMode) {
      case 'desktop': return { width: 1200, height: 800 };
      case 'tablet': return { width: 768, height: 1024 };
      case 'mobile': return { width: 375, height: 667 };
      default: return { width: 1200, height: 800 };
    }
  };

  const deviceSize = getDeviceSize();

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

  const DraggableCanvasItem: React.FC<{
    component: CanvasComponentInstance;
    isSelected: boolean;
  }> = ({ component, isSelected }) => {
    const [isHovered, setIsHovered] = useState(false);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: component.id,
      disabled: component.isLocked,
      data: {
        id: component.id,
        type: component.type,
        name: component.name,
        isPaletteItem: false,
        initialData: component,
        width: component.width,
        height: component.height,
      } as DndDragItem,
    });

    const style: React.CSSProperties = {
      position: 'absolute',
      left: component.left,
      top: component.top,
      width: component.width,
      height: component.height,
      opacity: isDragging ? 0.5 : component.isVisible !== false ? 1 : 0.3,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      zIndex: isDragging ? 1000 : isSelected ? 100 : 'auto',
      cursor: component.isLocked ? 'not-allowed' : 'move',
    };

    const renderComponentContent = () => {
      switch (component.type) {
        case 'text':
          return (
            <div className="w-full h-full flex items-center justify-start text-sm text-gray-700 px-2 border border-dashed border-gray-300 bg-white">
              {component.props.text as React.ReactNode || 'Text'}
            </div>
          );
        case 'heading':
          return (
            <div className="w-full h-full flex items-center justify-start font-bold text-gray-800 px-2 border border-dashed border-gray-300 bg-white">
              {component.props.text as React.ReactNode || 'Heading'}
            </div>
          );
        case 'button':
          return (
            <button className="w-full h-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors font-medium">
              {component.props.text as React.ReactNode || 'Button'}
            </button>
          );
        case 'image':
          return (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center border border-dashed border-gray-300">
              {component.props.src ? (
                <img src={component.props.src as string} alt={component.props.alt as string} className="w-full h-full object-cover rounded" />
              ) : (
                <div className="text-gray-500 text-center">
                  <Image className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-xs">Image</div>
                </div>
              )}
            </div>
          );
        default:
          return (
            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-600 text-sm border border-dashed border-gray-300">
              {component.name}
            </div>
          );
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...(component.isLocked ? {} : listeners)}
        {...(component.isLocked ? {} : attributes)}
        className={`
          group relative transition-all duration-200 rounded-lg
          ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-75' : ''}
          ${isHovered && !isSelected ? 'ring-1 ring-blue-300' : ''}
          ${component.isLocked ? 'cursor-not-allowed' : 'cursor-move'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectComponent(component.id, e.shiftKey);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderComponentContent()}

        {/* Selection Handles */}
        {isSelected && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
          </>
        )}

        {/* Component Label */}
        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {component.name}
        </div>

        {/* Lock Indicator */}
        {component.isLocked && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <Lock className="w-2 h-2 text-white" />
          </div>
        )}
      </div>
    );
  };

  const deviceContentStyle: React.CSSProperties = {
    transform: `scale(${zoomLevel}) translate(${canvasOffset.x / zoomLevel}px, ${canvasOffset.y / zoomLevel}px)`,
    transformOrigin: 'top left',
    width: deviceSize.width,
    height: deviceSize.height,
    position: 'relative',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden">
      {/* Canvas Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => setShowRulers(!showRulers)}
            className={`p-2 rounded-lg transition-colors ${showRulers ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Toggle Rulers"
          >
            📏
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Toggle Grid"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <span className="text-sm font-medium text-gray-700">
            {deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} • {deviceSize.width}×{deviceSize.height}
          </span>
        </div>
      </div>

      {/* Rulers */}
      {showRulers && (
        <>
          <div className="absolute top-16 left-0 right-0 h-6 bg-white border-b border-gray-200 z-10 flex items-end text-xs text-gray-500">
            {Array.from({ length: Math.ceil(1600 / 50) }, (_, i) => (
              <div key={i} className="absolute" style={{ left: i * 50 + 'px' }}>
                <div className="w-px h-3 bg-gray-300"></div>
                <span className="ml-1">{i * 50}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-6 bottom-0 bg-white border-r border-gray-200 z-10 pt-16">
            {Array.from({ length: Math.ceil(1200 / 50) }, (_, i) => (
              <div key={i} className="absolute text-xs text-gray-500" style={{ top: i * 50 + 'px' }}>
                <div className="h-px w-3 bg-gray-300"></div>
                <span className="ml-1 transform -rotate-90 origin-left">{i * 50}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Main Canvas */}
      <div className={`h-full flex items-center justify-center p-8 ${showRulers ? 'pt-24 pl-14' : ''}`}>
        <div className="relative">
          {/* Device Frame */}
          <div
            ref={setDroppableNodeRef}
            className="relative bg-white shadow-2xl"
            style={deviceContentStyle}
          >
            {/* Grid */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundSize: '20px 20px',
                  backgroundImage: `
                    linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                  `,
                }}
              />
            )}

            {/* Drop Indicator */}
            {isOver && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-500 flex items-center justify-center">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
                  Drop component here
                </div>
              </div>
            )}

            {/* Empty State */}
            {canvasComponents.length === 0 && !isOver && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Plus className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Start Building</h3>
                  <p className="text-gray-500 mb-6 max-w-sm leading-relaxed">
                    Drag components from the left panel to begin creating your website.
                  </p>
                </div>
              </div>
            )}

            {/* Components */}
            {canvasComponents.map((component) => (
              <DraggableCanvasItem
                key={component.id}
                component={component}
                isSelected={selectedComponentIds.includes(component.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Properties Panel
const EnhancedPropertiesPanel: React.FC<{
  selectedComponent?: CanvasComponentInstance | null;
  isOpen: boolean;
}> = ({ selectedComponent, isOpen }) => {
  const [activeTab, setActiveTab] = useState<string>("Style");

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Properties
        </h3>
        
        {selectedComponent && (
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Box className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{selectedComponent.name}</h4>
                <p className="text-sm text-gray-500">{selectedComponent.type}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedComponent ? (
        <>
          {/* Tabs */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {["Style", "Layout", "Effects"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2 text-sm rounded-md font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "Style" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4">Typography</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Font Size</label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        defaultValue="16"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Font Weight</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="600">Semibold</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4">Colors</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Text Color</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded border"></div>
                        <input type="text" value="#000000" className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Background</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded border"></div>
                        <input type="text" value="#FFFFFF" className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Layout" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4">Position & Size</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Width</label>
                      <input type="number" value={selectedComponent.width} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Height</label>
                      <input type="number" value={selectedComponent.height} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">X Position</label>
                      <input type="number" value={selectedComponent.left} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Y Position</label>
                      <input type="number" value={selectedComponent.top} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Effects" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4">Shadow</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Blur</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        defaultValue="0"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="100"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No Selection</h4>
            <p className="text-gray-500 text-sm">Select a component to edit its properties</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Commercial Builder Page Component
const CommercialBuilderPage: React.FC = () => {
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponentInstance[]>([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [history, setHistory] = useState<CanvasComponentInstance[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeDragItem, setActiveDragItem] = useState<DndDragItem | null>(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const updateHistory = useCallback((newCanvasState: CanvasComponentInstance[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newCanvasState]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevHistoryIndex = historyIndex - 1;
      setHistoryIndex(prevHistoryIndex);
      setCanvasComponents([...history[prevHistoryIndex]]);
      setSelectedComponentIds([]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextHistoryIndex = historyIndex + 1;
      setHistoryIndex(nextHistoryIndex);
      setCanvasComponents([...history[nextHistoryIndex]]);
      setSelectedComponentIds([]);
    }
  }, [history, historyIndex]);

  const handleSave = useCallback(async () => {
    // Implement save functionality
    console.log('Saving project...', canvasComponents);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
  }, [canvasComponents]);

  const handlePreview = useCallback(() => {
    // Implement preview functionality
    console.log('Opening preview...');
  }, []);

  const handlePublish = useCallback(async () => {
    // Implement publish functionality
    console.log('Publishing website...', canvasComponents);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate publish
  }, [canvasComponents]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.25));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setCanvasOffset({ x: 0, y: 0 });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current) {
      setActiveDragItem(active.data.current as DndDragItem);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveDragItem(null);

    if (!over || !active.data.current) return;

    const dragItemData = active.data.current as DndDragItem;
    const overId = over.id as string;

    if (overId === 'canvas-droppable-area') {
      let newComponentsState: CanvasComponentInstance[] = [...canvasComponents];

      if (dragItemData.isPaletteItem) {
        // Adding new component from palette
        const paletteItem = dragItemData.initialData as PaletteItem;
        const newComponent: CanvasComponentInstance = {
          id: `${paletteItem.type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: paletteItem.type,
          name: paletteItem.name,
          left: Math.max(0, 100 + (delta.x / zoomLevel)),
          top: Math.max(0, 100 + (delta.y / zoomLevel)),
          width: typeof paletteItem.defaultWidth === 'number' ? paletteItem.defaultWidth : 200,
          height: typeof paletteItem.defaultHeight === 'number' ? paletteItem.defaultHeight : 50,
          props: { ...paletteItem.defaultProps },
          isVisible: true,
          isLocked: false,
          isPaletteItem: false, // Add missing property
          responsiveStyles: {}, // Add missing property
        };
        newComponentsState = [...canvasComponents, newComponent];
        setSelectedComponentIds([newComponent.id]);
      } else {
        // Moving existing component
        const existingComponent = dragItemData.initialData as CanvasComponentInstance;
        newComponentsState = canvasComponents.map(comp =>
          comp.id === active.id 
            ? { 
                ...comp, 
                left: Math.max(0, comp.left + (delta.x / zoomLevel)),
                top: Math.max(0, comp.top + (delta.y / zoomLevel))
              } 
            : comp
        );
      }

      setCanvasComponents(newComponentsState);
      updateHistory(newComponentsState);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlCmd = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlCmd && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      } else if (ctrlCmd && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
        event.preventDefault();
        handleRedo();
      } else if (ctrlCmd && event.key === 's') {
        event.preventDefault();
        handleSave();
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedComponentIds.length > 0) {
          event.preventDefault();
          const newState = canvasComponents.filter(comp => !selectedComponentIds.includes(comp.id));
          setCanvasComponents(newState);
          updateHistory(newState);
          setSelectedComponentIds([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleSave, selectedComponentIds, canvasComponents, updateHistory]);

  const selectedComponent = selectedComponentIds.length === 1 
    ? canvasComponents.find(c => c.id === selectedComponentIds[0]) 
    : null;

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd} 
      collisionDetection={closestCenter}
    >
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Top Toolbar */}
        <ProfessionalTopToolbar
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          zoomLevel={zoomLevel}
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
          deviceMode={deviceMode}
          onDeviceChange={setDeviceMode}
          isLeftPanelOpen={isLeftPanelOpen}
          isRightPanelOpen={isRightPanelOpen}
          onToggleLeftPanel={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Components */}
          <EnhancedComponentPalette isOpen={isLeftPanelOpen} />

          {/* Canvas Area */}
          <ProfessionalCanvas
            canvasComponents={canvasComponents}
            setCanvasComponents={setCanvasComponents}
            selectedComponentIds={selectedComponentIds}
            setSelectedComponentIds={setSelectedComponentIds}
            zoomLevel={zoomLevel}
            canvasOffset={canvasOffset}
            setCanvasOffset={setCanvasOffset}
            deviceMode={deviceMode}
            updateHistory={updateHistory}
          />

          {/* Right Panel - Properties */}
          <EnhancedPropertiesPanel 
            selectedComponent={selectedComponent}
            isOpen={isRightPanelOpen}
          />
        </div>

        {/* Bottom Status Bar */}
        <div className="h-10 bg-white border-t border-gray-200 flex items-center justify-between px-6 text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <span>{canvasComponents.length} components</span>
            {selectedComponentIds.length > 0 && (
              <span className="text-blue-600 font-medium">{selectedComponentIds.length} selected</span>
            )}
          </div>
          <div className="flex items-center gap-6">
            <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default CommercialBuilderPage;
