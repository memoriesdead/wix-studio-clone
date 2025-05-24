"use client";

import React from 'react';
import { 
  Box, 
  MousePointer as MousePointerIcon, 
  Monitor, 
  Zap, 
  Clock, 
  Code, 
  Share, 
  Wifi 
} from 'lucide-react';

interface StatusBarProps {
  componentCount: number;
  selectedComponentName?: string | null; // Name of the currently selected component
  currentZoomLevel?: number; // e.g., 1 for 100%
  pageLoadTime?: string | null; // e.g., "1.2s"
  performanceScore?: number | null; // e.g., 98
  saveStatus?: 'Saved' | 'Saving...' | 'Unsaved Changes';
  // Add more props as needed
}

const ProfessionalStatusBar: React.FC<StatusBarProps> = ({ 
  componentCount,
  selectedComponentName,
  currentZoomLevel,
  pageLoadTime,
  performanceScore,
  saveStatus = 'Saved',
}) => {
  return (
    <div className="h-8 bg-theme-bg-primary border-t border-theme-border-primary flex items-center justify-between px-6 text-xs text-theme-text-muted">
      {/* Left Section - Component Info */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2" title="Total components on canvas">
          <Box className="w-3 h-3" />
          <span>{componentCount} Components</span>
        </div>
        
        {selectedComponentName && (
          <div className="flex items-center space-x-2" title="Selected component">
            <MousePointerIcon className="w-3 h-3" />
            <span>{selectedComponentName}</span>
          </div>
        )}
        
        {currentZoomLevel && (
          <div className="flex items-center space-x-2" title="Current zoom level">
            <Monitor className="w-3 h-3" />
            <span>{(currentZoomLevel * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
      
      {/* Center Section - Performance & Status */}
      <div className="flex items-center space-x-6">
        <div className={`flex items-center space-x-2 ${saveStatus === 'Saved' ? 'text-theme-accent-success' : 'text-theme-accent-warning'}`} title={`Save status: ${saveStatus}`}>
          <div className={`w-2 h-2 ${saveStatus === 'Saved' ? 'bg-theme-accent-success' : 'bg-theme-accent-warning'} rounded-full ${saveStatus === 'Saving...' ? 'animate-pulse' : ''}`}></div>
          <span>{saveStatus}</span>
        </div>
        
        {performanceScore && (
          <div className="flex items-center space-x-2" title="Performance Score">
            <Zap className="w-3 h-3" />
            <span>{performanceScore}</span>
          </div>
        )}
        
        {pageLoadTime && (
          <div className="flex items-center space-x-2" title="Page Load Time">
            <Clock className="w-3 h-3" />
            <span>{pageLoadTime}</span>
          </div>
        )}
      </div>
      
      {/* Right Section - Tools */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1 hover:text-theme-text-primary transition-colors" title="View Generated Code">
          <Code className="w-3 h-3" />
          <span>Code</span>
        </button>
        
        <button className="flex items-center space-x-1 hover:text-theme-text-primary transition-colors" title="Share Project">
          <Share className="w-3 h-3" />
          <span>Share</span>
        </button>
        
        <div className="w-px h-4 bg-theme-border-primary"></div>
        
        <div className="flex items-center space-x-1" title="Connection Status">
          <Wifi className="w-3 h-3 text-theme-accent-success" />
          <span>Online</span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalStatusBar;
