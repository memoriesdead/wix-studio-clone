//testing
"use client";

import React from 'react';
import VercelConnection from '@/components/VercelConnection'; // Added import
import {
  ChevronDown,
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  ZoomOut,
  ZoomIn,
  Save, // Assuming Save icon for save status
  UploadCloud, // Assuming for Publish
} from 'lucide-react';

interface TopToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // onToggleGrid: () => void; // Grid toggle might move to canvas toolbar
  // isGridVisible: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom?: () => void; // Optional
  zoomLevel: number;
  onSave: () => void;
  onPublish: () => void; // Added for publish
  projectName?: string;
  userAvatar?: string; // URL or initials
  onPreview?: () => void;
  // TODO: Add props for Device Toggle
  currentDevice?: 'desktop' | 'tablet' | 'mobile';
  onSetDevice?: (device: 'desktop' | 'tablet' | 'mobile') => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoomLevel,
  onSave,
  onPublish,
  projectName = "My Awesome Website",
  userAvatar = "JD",
  onPreview,
  currentDevice = 'desktop',
  onSetDevice,
}) => {
  const isSaved = true; // Placeholder for actual save status logic

  return (
    <div className="h-16 bg-theme-bg-secondary border-b border-theme-border-primary flex items-center justify-between px-6 shrink-0">
      {/* Left Section - Logo & Project */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-theme-accent-primary to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span> {/* Placeholder Logo */}
          </div>
          <span className="text-theme-text-primary font-semibold">WebStudio</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-theme-bg-tertiary rounded-lg px-3 py-2 cursor-pointer hover:bg-opacity-80">
          <div className={`w-2 h-2 ${isSaved ? 'bg-theme-accent-success' : 'bg-theme-accent-warning'} rounded-full animate-pulse`}></div>
          <span className="text-theme-text-secondary text-sm">{projectName}</span>
          <ChevronDown className="w-4 h-4 text-theme-text-muted" />
        </div>
      </div>

      {/* Center Section - Actions */}
      <div className="flex items-center space-x-1 bg-theme-bg-tertiary rounded-lg p-1">
        <button 
          onClick={onUndo} 
          disabled={!canUndo} 
          className="p-2 text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-secondary rounded-md transition-all disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button 
          onClick={onRedo} 
          disabled={!canRedo} 
          className="p-2 text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-secondary rounded-md transition-all disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-theme-border-primary mx-2"></div>
        
        <button 
          onClick={() => onSetDevice?.('desktop')}
          className={`p-2 rounded-md transition-all ${currentDevice === 'desktop' ? 'text-theme-accent-primary bg-theme-accent-primary/10' : 'text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-secondary'}`}
          title="Desktop Preview"
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onSetDevice?.('tablet')}
          className={`p-2 rounded-md transition-all ${currentDevice === 'tablet' ? 'text-theme-accent-primary bg-theme-accent-primary/10' : 'text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-secondary'}`}
          title="Tablet Preview"
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onSetDevice?.('mobile')}
          className={`p-2 rounded-md transition-all ${currentDevice === 'mobile' ? 'text-theme-accent-primary bg-theme-accent-primary/10' : 'text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-secondary'}`}
          title="Mobile Preview"
        >
          <Smartphone className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-theme-border-primary mx-2"></div>
        
        <button onClick={onZoomOut} className="p-2 text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-secondary rounded-md transition-all" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span 
          onClick={onResetZoom} 
          className="text-theme-text-secondary text-sm font-medium px-2 cursor-pointer hover:text-theme-text-primary"
          title="Reset Zoom"
        >
          {(zoomLevel * 100).toFixed(0)}%
        </span>
        <button onClick={onZoomIn} className="p-2 text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-secondary rounded-md transition-all" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-3">
        <div className={`flex items-center space-x-2 text-sm ${isSaved ? 'text-theme-accent-success' : 'text-theme-accent-warning'}`}>
          <div className={`w-2 h-2 ${isSaved ? 'bg-theme-accent-success' : 'bg-theme-accent-warning'} rounded-full`}></div>
          <span>{isSaved ? 'Saved' : 'Unsaved'}</span>
        </div>
        
        <button 
          onClick={onPreview}
          className="px-4 py-2 bg-theme-bg-tertiary text-theme-text-secondary rounded-lg hover:bg-opacity-80 transition-all text-sm"
        >
          Preview
        </button>
        <VercelConnection /> 
        <button 
          onClick={onPublish}
          className="px-4 py-2 bg-gradient-to-r from-theme-accent-primary to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm font-medium"
        >
          Publish
        </button>
        
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer" title="User Profile">
          <span className="text-white text-sm font-medium">{userAvatar}</span>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;
