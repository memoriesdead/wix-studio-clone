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
  Box, // Added import
  Columns, // Added import
  Grid3X3 // Added import
} from 'lucide-react';
import { CanvasComponentInstance, BuilderComponentType } from '@/lib/types'; // Added BuilderComponentType

// Example: Define a type for the selected component's data
// This would be more detailed based on actual component properties
interface SelectedComponentInfo {
  id: string;
  type: string; // e.g., 'Text Block', 'Image'
  name: string; // User-defined name or default
  // ... other common properties
}

interface PropertiesPanelProps {
  selectedComponent?: CanvasComponentInstance | null; // Pass the full component data
  // onUpdateProperty: (componentId: string, propertyPath: string, value: any) => void;
  // onCopyComponent: (componentId: string) => void;
  // onDeleteComponent: (componentId: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  // onUpdateProperty,
  // onCopyComponent,
  // onDeleteComponent,
}) => {
  const [activeTab, setActiveTab] = useState<string>("Content");

  // Placeholder for actual component data and update logic
  const currentProperties = selectedComponent?.props || {};
  // const componentTypeIcon = selectedComponent ? Type : Type; // Default icon, map to actual icons later
  // This will be replaced by IconForSelected

  const handlePropertyChange = (propName: string, value: unknown) => {
    // if (selectedComponent && onUpdateProperty) {
    //   onUpdateProperty(selectedComponent.id, propName, value);
    // }
    console.log(`Property ${propName} changed to:`, value);
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
      [BuilderComponentType.Icon]: Sparkles, // Example, could be specific icon component
      [BuilderComponentType.Divider]: () => <Move className="w-4 h-4 text-white transform rotate-90" />, // Example
      [BuilderComponentType.Spacer]: () => <Move className="w-4 h-4 text-white" />, // Example
      // ... add other component types
    };
    const SelectedIcon = Icons[type] || Type;
    return <SelectedIcon className="w-4 h-4 text-white" />;
  };


  return (
    <div className="w-80 bg-theme-bg-primary border-l border-theme-border-primary flex flex-col">
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
        <div className="bg-theme-bg-secondary rounded-lg p-3">
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
      </div>

      {/* Property Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-theme-border-primary">
          <div className="flex space-x-1 bg-theme-bg-secondary rounded-lg p-1">
            {["Content", "Style", "Layout", "Effects"].map(tab => (
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
              {/* Add more content-specific properties here based on component type */}
            </>
          )}

          {activeTab === "Style" && (
            <>
              <div>
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
                        value={(currentProperties.fontFamily as string) || 'Inter'}
                        onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                        aria-label="Font Family"
                      >
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
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
                        value={(currentProperties.fontSize as number) || 16}
                        onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value,10))}
                      />
                    </div>
                    <div>
                      <label htmlFor="fontWeightSelect" className="block text-xs text-theme-text-muted mb-1">Weight</label>
                      <select 
                        id="fontWeightSelect"
                        className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg px-3 py-2 text-theme-text-primary focus:border-theme-accent-primary appearance-none"
                        value={(currentProperties.fontWeight as number) || 400}
                        onChange={(e) => handlePropertyChange('fontWeight', parseInt(e.target.value,10))}
                      >
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                      </select>
                      {/* Chevron for select might be needed if appearance-none hides it completely and custom one is desired */}
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
                      <div className="w-6 h-6 rounded cursor-pointer border-2 border-theme-border-hover" style={{backgroundColor: (currentProperties.color as string) || '#ffffff'}}></div>
                      <input
                        type="text"
                        className="w-24 bg-theme-bg-secondary border border-theme-border-primary rounded px-2 py-1 text-xs text-theme-text-primary"
                        value={(currentProperties.color as string) || '#FFFFFF'}
                        onChange={(e) => handlePropertyChange('color', e.target.value)}
                        aria-label="Text Color Hex Value"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-theme-text-muted">Background</span>
                    <div className="flex items-center space-x-2">
                       <div className="w-6 h-6 rounded cursor-pointer border-2 border-theme-border-hover" style={{backgroundColor: (currentProperties.backgroundColor as string) || 'transparent'}} title="Pick Background Color"></div>
                      <input
                        type="text"
                        className="w-24 bg-theme-bg-secondary border border-theme-border-primary rounded px-2 py-1 text-xs text-theme-text-primary"
                        value={(currentProperties.backgroundColor as string) || 'transparent'}
                        onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
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
                    Spacing & Position
                </h4>
                {/* Placeholder for Layout controls */}
                <p className="text-theme-text-muted text-sm">Layout controls (position, dimensions, margin, padding) will appear here.</p>
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
