"use client";

import React, { useState } from 'react';
import { 
  Copy, 
  Trash2, 
  Type, 
  Palette, 
  Move, 
  Sparkles, 
  ChevronDown, 
  // Eyedropper, // Not available in lucide-react
  PaintBucket, // Using PaintBucket as a replacement for Eyedropper
  Plus,
  MousePointer as MousePointerIcon, // Alias to avoid conflict
  Box, 
  Columns, 
  Grid3X3,
  AlignJustify, // For FlexContainer
  LayoutGrid, // For GridContainer
  Smartphone, // For Mobile breakpoint
  Tablet, // For Tablet breakpoint
  Monitor, // For Desktop breakpoint
  Youtube // For Video
} from 'lucide-react';
import { CanvasComponentInstance, BuilderComponentType, ResponsiveStyles, CSSProperties } from '@/lib/types';

// Example: Define a type for the selected component's data
// This would be more detailed based on actual component properties
interface SelectedComponentInfo {
  id: string;
  type: string; // e.g., 'Text Block', 'Image'
  name: string; // User-defined name or default
  // ... other common properties
}

interface PropertiesPanelProps {
  selectedComponent?: CanvasComponentInstance | null;
  allCanvasComponents?: CanvasComponentInstance[]; // Added to get parent info
  onUpdateProperty: (componentId: string, propertyPath: string, value: any, breakpoint?: keyof ResponsiveStyles) => void; // Added breakpoint
  // onCopyComponent: (componentId: string) => void;
  // onDeleteComponent: (componentId: string) => void;
}

type Breakpoint = keyof ResponsiveStyles | 'desktop'; // 'desktop' represents base styles

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  allCanvasComponents = [], // Default to empty array
  onUpdateProperty,
  // onCopyComponent,
  // onDeleteComponent,
}) => {
  const [activeTab, setActiveTab] = useState<string>("Style"); // Default to Style tab
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('desktop');

  const currentProperties = selectedComponent?.props || {};
  
  // Get the effective style for the current breakpoint
  const getEffectiveStyle = (): CSSProperties => {
    if (!selectedComponent) return {};
    const baseStyle = selectedComponent.style || {};
    if (activeBreakpoint === 'desktop') {
      return baseStyle;
    }
    return {
      ...baseStyle,
      ...(selectedComponent.responsiveStyles?.[activeBreakpoint] || {}),
    };
  };
  const effectiveStyles = getEffectiveStyle();


  const handlePropertyChange = (
    propName: string, 
    value: unknown, 
    isStyleProp: boolean = false,
    isLayoutProp: boolean = false // To differentiate props that might not be in 'style' object directly
  ) => {
    if (selectedComponent) {
      if (isStyleProp) {
        // If it's a style prop, update either base style or responsive style
        const propertyPath = activeBreakpoint === 'desktop' 
          ? `style.${propName}` 
          : `responsiveStyles.${activeBreakpoint}.${propName}`;
        onUpdateProperty(selectedComponent.id, propertyPath, value, activeBreakpoint === 'desktop' ? undefined : activeBreakpoint);
      } else if (isLayoutProp) {
        // For layout props that might be top-level or in props object (e.g. display, flexDirection)
        // This needs careful handling based on where these props are stored.
        // For now, assume they might be part of the 'style' object for simplicity in this step.
        // Or, if they are direct component props: `props.${propName}`
        // Let's assume for now they are treated like style props for responsive handling
        const propertyPath = activeBreakpoint === 'desktop' 
        ? `style.${propName}` 
        : `responsiveStyles.${activeBreakpoint}.${propName}`;
        onUpdateProperty(selectedComponent.id, propertyPath, value, activeBreakpoint === 'desktop' ? undefined : activeBreakpoint);

      } else if (propName === 'className') {
         onUpdateProperty(selectedComponent.id, 'className', value);
      }
      else {
        // For other props (like text content, src, etc.)
        onUpdateProperty(selectedComponent.id, `props.${propName}`, value);
      }
    }
    // console.log(`Property ${propName} changed to:`, value, `at breakpoint: ${activeBreakpoint}`);
  };


  if (!selectedComponent) {
    return (
      <div className="w-80 bg-theme-bg-primary border-l border-theme-border-primary flex flex-col p-6">
        <h3 className="text-xl font-bold text-theme-text-primary mb-4">Properties</h3>
        <div className="text-sm text-theme-text-muted text-center mt-10">
          Select a component on the canvas to see its properties.
        </div>
      </div>
    );
  }
  
  const IconForSelected = ({ type }: { type: BuilderComponentType }) => {
    const Icons = {
      [BuilderComponentType.Text]: Type,
      [BuilderComponentType.Heading]: Type, // Could be more specific, e.g., Heading1, Heading2 icons
      [BuilderComponentType.Button]: MousePointerIcon,
      [BuilderComponentType.Image]: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
      [BuilderComponentType.Section]: Box,
      [BuilderComponentType.Container]: Box,
      [BuilderComponentType.Columns]: Columns,
      [BuilderComponentType.Grid]: Grid3X3,
      [BuilderComponentType.FlexContainer]: AlignJustify,
      [BuilderComponentType.GridContainer]: LayoutGrid,
      [BuilderComponentType.Video]: Youtube, // Icon for Video
      [BuilderComponentType.Icon]: Sparkles, // Example, could be specific icon component
      [BuilderComponentType.Divider]: () => <Move className="w-4 h-4 text-white transform rotate-90" />, // Example
      [BuilderComponentType.Spacer]: () => <Move className="w-4 h-4 text-white" />, // Example
      // ... add other component types
    };
    const SelectedIcon = Icons[type] || Box; // Default to Box if no specific icon
    return <SelectedIcon className="w-4 h-4 text-white" />;
  };


  const breakpointIcons: Record<Breakpoint, React.ElementType> = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  const renderBreakpointSwitcher = () => (
    <div className="mb-4 p-1 bg-theme-bg-secondary rounded-lg flex items-center justify-center space-x-1">
      {(['desktop', 'tablet', 'mobile'] as Breakpoint[]).map(bp => {
        const Icon = breakpointIcons[bp];
        return (
          <button
            key={bp}
            title={bp.charAt(0).toUpperCase() + bp.slice(1)}
            onClick={() => setActiveBreakpoint(bp)}
            className={`p-2 rounded-md ${activeBreakpoint === bp ? 'bg-theme-accent-primary/20 text-theme-accent-primary' : 'text-theme-text-muted hover:bg-theme-bg-tertiary'}`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="w-80 bg-theme-bg-primary border-l border-theme-border-primary flex flex-col h-full overflow-hidden"> {/* Added overflow-hidden */}
      {/* Header */}
      <div className="p-6 border-b border-theme-border-primary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-theme-text-primary">Properties</h3>
          <div className="flex space-x-1">
            <button 
              // onClick={() => selectedComponent && onCopyComponent(selectedComponent.id)}
              className="p-1.5 text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-tertiary rounded-md" 
              title="Copy Component"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              // onClick={() => selectedComponent && onDeleteComponent(selectedComponent.id)}
              className="p-1.5 text-theme-text-muted hover:text-theme-accent-secondary hover:bg-theme-bg-tertiary rounded-md" 
              title="Delete Component"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Selected Component Info */}
        <div className="bg-theme-bg-secondary rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-theme-accent-primary to-purple-600 rounded-lg flex items-center justify-center">
              <IconForSelected type={selectedComponent.type} />
            </div>
            <div className="flex-1">
              <h4 className="text-theme-text-primary font-medium truncate">{selectedComponent.name}</h4>
              <p className="text-theme-text-muted text-xs truncate">ID: {selectedComponent.id.substring(0,12)}...</p>
            </div>
          </div>
        </div>
        {/* Breakpoint Switcher */}
        {renderBreakpointSwitcher()}
      </div>

      {/* Property Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-theme-border-primary">
          <div className="flex space-x-1 bg-theme-bg-secondary rounded-lg p-1">
            {["Style", "Layout", "Content", "Effects"].map(tab => ( // Reordered tabs
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 text-xs rounded-md font-medium transition-all ${activeTab === tab ? 'text-theme-accent-primary bg-theme-accent-primary/10' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Property Controls - Content depends on activeTab and selectedComponent.type */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "Content" && (
            <>
              { (selectedComponent.type === BuilderComponentType.Text || selectedComponent.type === BuilderComponentType.Heading || selectedComponent.type === BuilderComponentType.Button) &&
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    Text Content
                  </label>
                  <textarea
                    className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary placeholder-theme-text-muted focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all resize-none"
                    rows={3}
                    placeholder="Enter your text..."
                    value={(currentProperties.text as string) || ''}
                    onChange={(e) => handlePropertyChange('text', e.target.value)}
                    aria-label="Text Content"
                  />
                </div>
              }
              { selectedComponent.type === BuilderComponentType.Image &&
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    Image Source (URL)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary placeholder-theme-text-muted focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all"
                    placeholder="https://example.com/image.png"
                    value={(currentProperties.src as string) || ''}
                    onChange={(e) => handlePropertyChange('src', e.target.value)}
                    aria-label="Image Source"
                  />
                   <label className="block text-sm font-medium text-theme-text-secondary mt-3 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary placeholder-theme-text-muted focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all"
                    placeholder="Descriptive alt text"
                    value={(currentProperties.alt as string) || ''}
                    onChange={(e) => handlePropertyChange('alt', e.target.value)}
                    aria-label="Alt Text"
                  />
                </div>
              }
               { selectedComponent.type === BuilderComponentType.Button &&
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mt-3 mb-2">
                    Link URL
                  </label>
                  <input
                    type="text"
                    className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary placeholder-theme-text-muted focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all"
                    placeholder="#"
                    value={(currentProperties.link as string) || ''}
                    onChange={(e) => handlePropertyChange('link', e.target.value)}
                    aria-label="Link URL"
                  />
                </div>
              }
              { selectedComponent.type === BuilderComponentType.Video &&
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    Video Source (URL)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary placeholder-theme-text-muted focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all"
                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                    value={(currentProperties.src as string) || ''}
                    onChange={(e) => handlePropertyChange('src', e.target.value)}
                    aria-label="Video Source URL"
                  />
                  {/* Add controls for autoplay, loop, controls visibility later */}
                </div>
              }
              {/* Add more content-specific properties here based on component type */}
            </>
          )}

          {activeTab === "Style" && (
            <>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                  Custom Classes
                </label>
                <input
                  type="text"
                  className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary placeholder-theme-text-muted focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all"
                  placeholder="e.g., text-blue-500 p-4"
                  value={selectedComponent.className || ''}
                  onChange={(e) => handlePropertyChange('className', e.target.value)}
                  aria-label="Custom Classes"
                />
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-theme-text-primary mb-4 flex items-center">
                  <Type className="w-4 h-4 mr-2 text-theme-text-muted" />
                  Typography
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-theme-text-muted mb-2">Font Family</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2.5 text-theme-text-primary focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all appearance-none"
                        value={effectiveStyles.fontFamily || 'Inter'}
                        onChange={(e) => handlePropertyChange('fontFamily', e.target.value, true)}
                        aria-label="Font Family"
                      >
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                        <option value="MadeFor-Display, sans-serif">MadeFor-Display</option>
                        <option value="MadeFor-Text, sans-serif">MadeFor-Text</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="fontSizeInput" className="block text-xs text-theme-text-muted mb-1">Size (px)</label>
                      <input
                        id="fontSizeInput"
                        type="number"
                        className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary"
                        value={parseInt(String(effectiveStyles.fontSize || '16'))}
                        onChange={(e) => handlePropertyChange('fontSize', `${e.target.value}px`, true)}
                      />
                    </div>
                    <div>
                      <label htmlFor="fontWeightSelect" className="block text-xs text-theme-text-muted mb-1">Weight</label>
                      <select 
                        id="fontWeightSelect"
                        className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary appearance-none"
                        value={String(effectiveStyles.fontWeight || '400')}
                        onChange={(e) => handlePropertyChange('fontWeight', e.target.value, true)}
                      >
                        <option value="300">Light</option>
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="600">Semi-Bold</option>
                        <option value="700">Bold</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-theme-text-primary mb-4 flex items-center mt-6">
                  <Palette className="w-4 h-4 mr-2 text-theme-text-muted" />
                  Colors
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-theme-text-muted">Text Color</span>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        className="w-6 h-6 rounded cursor-pointer border-2 border-theme-border-hover p-0" 
                        value={String(effectiveStyles.color || '#ffffff').startsWith('#') ? String(effectiveStyles.color || '#ffffff') : '#ffffff'}
                        onChange={(e) => handlePropertyChange('color', e.target.value, true)}
                        title="Pick Text Color"
                      />
                      <input
                        type="text"
                        className="w-24 bg-theme-bg-secondary border border-theme-border-primary rounded px-2 py-1 text-xs text-theme-text-primary"
                        value={String(effectiveStyles.color || '#FFFFFF')}
                        onChange={(e) => handlePropertyChange('color', e.target.value, true)}
                        aria-label="Text Color Hex Value"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-theme-text-muted">Background</span>
                    <div className="flex items-center space-x-2">
                       <input 
                        type="color" 
                        className="w-6 h-6 rounded cursor-pointer border-2 border-theme-border-hover p-0" 
                        value={String(effectiveStyles.backgroundColor || '#000000').startsWith('#') ? String(effectiveStyles.backgroundColor || '#000000') : '#000000'}
                        onChange={(e) => handlePropertyChange('backgroundColor', e.target.value, true)}
                        title="Pick Background Color"
                      />
                      <input
                        type="text"
                        className="w-24 bg-theme-bg-secondary border border-theme-border-primary rounded px-2 py-1 text-xs text-theme-text-primary"
                        value={String(effectiveStyles.backgroundColor || 'transparent')}
                        onChange={(e) => handlePropertyChange('backgroundColor', e.target.value, true)}
                        aria-label="Background Color Hex Value"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
           {activeTab === "Layout" && (
            <div>
                <h4 className="text-sm font-semibold text-theme-text-primary mb-4 flex items-center">
                    <Move className="w-4 h-4 mr-2 text-theme-text-muted" />
                    Sizing & Spacing
                </h4>
                <div className="space-y-4">
                  {/* Width & Height */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="widthInput" className="block text-xs text-theme-text-muted mb-1">Width</label>
                      <input
                        id="widthInput"
                        type="text" // Allow units like px, %
                        className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary"
                        placeholder="auto"
                        value={String(effectiveStyles.width || '')}
                        onChange={(e) => handlePropertyChange('width', e.target.value, true)}
                      />
                    </div>
                    <div>
                      <label htmlFor="heightInput" className="block text-xs text-theme-text-muted mb-1">Height</label>
                      <input
                        id="heightInput"
                        type="text" // Allow units like px, %
                        className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary"
                        placeholder="auto"
                        value={String(effectiveStyles.height || '')}
                        onChange={(e) => handlePropertyChange('height', e.target.value, true)}
                      />
                    </div>
                  </div>
                  {/* Padding */}
                  <div>
                    <label className="block text-xs text-theme-text-muted mb-1">Padding (px)</label>
                    <div className="grid grid-cols-4 gap-1">
                      {['Top', 'Right', 'Bottom', 'Left'].map(side => (
                        <input
                          key={`padding${side}`}
                          type="number"
                          placeholder="0"
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-2 py-1 text-theme-text-primary text-xs focus:border-theme-accent-primary"
                          value={parseInt(String(effectiveStyles[`padding${side}` as keyof CSSProperties] || '')) || ''}
                          onChange={(e) => handlePropertyChange(`padding${side}`, `${e.target.value}px`, true)}
                          title={`Padding ${side}`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Margin */}
                  <div>
                    <label className="block text-xs text-theme-text-muted mb-1">Margin (px)</label>
                    <div className="grid grid-cols-4 gap-1">
                      {['Top', 'Right', 'Bottom', 'Left'].map(side => (
                        <input
                          key={`margin${side}`}
                          type="number"
                          placeholder="0"
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-2 py-1 text-theme-text-primary text-xs focus:border-theme-accent-primary"
                          value={parseInt(String(effectiveStyles[`margin${side}` as keyof CSSProperties] || '')) || ''}
                          onChange={(e) => handlePropertyChange(`margin${side}`, `${e.target.value}px`, true)}
                          title={`Margin ${side}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Flexbox Controls (conditionally rendered) */}
                {selectedComponent.type === BuilderComponentType.FlexContainer && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-theme-text-primary mb-4 flex items-center">
                        <AlignJustify className="w-4 h-4 mr-2 text-theme-text-muted" />
                        Flex Container
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-theme-text-muted mb-1">Direction</label>
                        <select 
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary appearance-none"
                          value={String(effectiveStyles.flexDirection || 'row')}
                          onChange={(e) => handlePropertyChange('flexDirection', e.target.value, true, true)}
                          aria-label="Flex Direction"
                        >
                          <option value="row">Row</option>
                          <option value="column">Column</option>
                          <option value="row-reverse">Row Reverse</option>
                          <option value="column-reverse">Column Reverse</option>
                        </select>
                         <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-text-muted pointer-events-none" />
                      </div>
                      {/* Justify Content */}
                      <div>
                        <label className="block text-xs text-theme-text-muted mb-1">Justify Content</label>
                        <select 
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary appearance-none"
                          value={String(effectiveStyles.justifyContent || 'flex-start')}
                          onChange={(e) => handlePropertyChange('justifyContent', e.target.value, true, true)}
                          aria-label="Justify Content"
                        >
                          <option value="flex-start">Start</option>
                          <option value="flex-end">End</option>
                          <option value="center">Center</option>
                          <option value="space-between">Space Between</option>
                          <option value="space-around">Space Around</option>
                          <option value="space-evenly">Space Evenly</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-text-muted pointer-events-none" />
                      </div>
                      {/* Align Items */}
                      <div>
                        <label className="block text-xs text-theme-text-muted mb-1">Align Items</label>
                        <select 
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary appearance-none"
                          value={String(effectiveStyles.alignItems || 'stretch')}
                          onChange={(e) => handlePropertyChange('alignItems', e.target.value, true, true)}
                          aria-label="Align Items"
                        >
                          <option value="stretch">Stretch</option>
                          <option value="flex-start">Start</option>
                          <option value="flex-end">End</option>
                          <option value="center">Center</option>
                          <option value="baseline">Baseline</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-text-muted pointer-events-none" />
                      </div>
                      {/* Flex Wrap */}
                      <div>
                        <label className="block text-xs text-theme-text-muted mb-1">Wrap</label>
                        <select 
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary appearance-none"
                          value={String(effectiveStyles.flexWrap || 'nowrap')}
                          onChange={(e) => handlePropertyChange('flexWrap', e.target.value, true, true)}
                          aria-label="Flex Wrap"
                        >
                          <option value="nowrap">No Wrap</option>
                          <option value="wrap">Wrap</option>
                          <option value="wrap-reverse">Wrap Reverse</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-text-muted pointer-events-none" />
                      </div>
                      {/* Gap */}
                      <div>
                        <label htmlFor="flexGapInput" className="block text-xs text-theme-text-muted mb-1">Gap (px)</label>
                        <input
                          id="flexGapInput"
                          type="number"
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary"
                          placeholder="0"
                          value={parseInt(String(effectiveStyles.gap || '0'))}
                          onChange={(e) => handlePropertyChange('gap', `${e.target.value}px`, true, true)}
                          aria-label="Gap"
                        />
                      </div>
                       {/* Display Flex (implicit for FlexContainer, but good to show) */}
                       <div>
                        <label className="block text-xs text-theme-text-muted mb-1">Display</label>
                        <input
                          type="text"
                          readOnly
                          className="w-full bg-theme-bg-tertiary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-muted focus:outline-none"
                          value="flex"
                          aria-label="Display Type"
                        />
                      </div>
                    </div>
                  </div>
                )}
                 {/* Grid Controls (conditionally rendered) */}
                 {selectedComponent.type === BuilderComponentType.GridContainer && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-theme-text-primary mb-4 flex items-center">
                        <LayoutGrid className="w-4 h-4 mr-2 text-theme-text-muted" />
                        Grid Container
                    </h4>
                     {/* Add Grid controls: gridTemplateColumns, gridTemplateRows, gap */}
                    <p className="text-theme-text-muted text-xs">Grid container controls (columns, rows, gap) coming soon.</p>
                  </div>
                )}

                {/* Flex Item Controls (conditionally rendered if parent is FlexContainer) */}
                {selectedComponent.parentId && allCanvasComponents.find(c => c.id === selectedComponent.parentId)?.type === BuilderComponentType.FlexContainer && (
                  <div className="mt-6 pt-6 border-t border-theme-border-primary">
                    <h4 className="text-sm font-semibold text-theme-text-primary mb-4 flex items-center">
                        <Box className="w-4 h-4 mr-2 text-theme-text-muted" /> {/* Using Box as a generic item icon */}
                        Flex Item
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label htmlFor="flexGrowInput" className="block text-xs text-theme-text-muted mb-1">Grow</label>
                          <input
                            id="flexGrowInput"
                            type="number"
                            className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary"
                            placeholder="0"
                            value={String(effectiveStyles.flexGrow || '0')}
                            onChange={(e) => handlePropertyChange('flexGrow', e.target.value, true, true)}
                            aria-label="Flex Grow"
                          />
                        </div>
                        <div>
                          <label htmlFor="flexShrinkInput" className="block text-xs text-theme-text-muted mb-1">Shrink</label>
                          <input
                            id="flexShrinkInput"
                            type="number"
                            className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary"
                            placeholder="1"
                            value={String(effectiveStyles.flexShrink || '1')}
                            onChange={(e) => handlePropertyChange('flexShrink', e.target.value, true, true)}
                            aria-label="Flex Shrink"
                          />
                        </div>
                        <div>
                          <label htmlFor="orderInput" className="block text-xs text-theme-text-muted mb-1">Order</label>
                          <input
                            id="orderInput"
                            type="number"
                            className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary"
                            placeholder="0"
                            value={String(effectiveStyles.order || '0')}
                            onChange={(e) => handlePropertyChange('order', e.target.value, true, true)}
                            aria-label="Order"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="flexBasisInput" className="block text-xs text-theme-text-muted mb-1">Basis</label>
                        <input
                          id="flexBasisInput"
                          type="text"
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary"
                          placeholder="auto"
                          value={String(effectiveStyles.flexBasis || 'auto')}
                          onChange={(e) => handlePropertyChange('flexBasis', e.target.value, true, true)}
                          aria-label="Flex Basis"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-theme-text-muted mb-1">Align Self</label>
                        <select 
                          className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary appearance-none"
                          value={String(effectiveStyles.alignSelf || 'auto')}
                          onChange={(e) => handlePropertyChange('alignSelf', e.target.value, true, true)}
                          aria-label="Align Self"
                        >
                          <option value="auto">Auto</option>
                          <option value="flex-start">Start</option>
                          <option value="flex-end">End</option>
                          <option value="center">Center</option>
                          <option value="stretch">Stretch</option>
                          <option value="baseline">Baseline</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-text-muted pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}


            </div>
           )}
           {activeTab === "Effects" && (
            <div>
                <h4 className="text-sm font-semibold text-theme-text-primary mb-4 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-theme-text-muted" />
                    Effects & Animations
                </h4>
                {/* Placeholder for Effects controls */}
                <p className="text-theme-text-muted text-sm">Effects (shadows, transforms, animations) will appear here.</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
