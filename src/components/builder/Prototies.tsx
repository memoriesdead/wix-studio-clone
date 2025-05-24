"use client";

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BuilderComponentType, PaletteItem, DndDragItem } from '@/lib/types';
import { 
  Search, 
  Grid3X3, 
  Type, 
  Heading as HeadingIcon, // Renamed to avoid conflict with HTMLHeadingElement
  MousePointer, 
  Image as ImageIcon, // Renamed
  Box, 
  Columns,
  Zap, // For Hero Section
  Mail, // For Contact Form
  FileText, // For Rich Text
  AlignJustify, // For Flexbox
  LayoutGrid, // For Grid Container
  Youtube, // For Video
  ChevronRight,
  LayoutPanelTop, // For Section
  BoxSelect // For Container
} from 'lucide-react'; // Added more icons

interface DraggablePaletteItemProps {
  item: PaletteItem;
  gridLayout?: boolean; // For switching between list and grid view
}

const DraggablePaletteItem: React.FC<DraggablePaletteItemProps> = ({ item, gridLayout }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${item.id}`,
    data: {
      id: item.id,
      type: item.type,
      name: item.name,
      isPaletteItem: true,
      initialData: item,
      width: typeof item.defaultWidth === 'number' ? item.defaultWidth : (parseInt(String(item.defaultWidth), 10) || 150),
      height: typeof item.defaultHeight === 'number' ? item.defaultHeight : (parseInt(String(item.defaultHeight), 10) || 50),
    } as DndDragItem,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.75 : 1,
  } : {
    opacity: isDragging ? 0.75 : 1,
  };

  // Icon mapping - extend as new components are added
  const IconComponent = {
    [BuilderComponentType.Text]: Type,
    [BuilderComponentType.Heading]: HeadingIcon,
    [BuilderComponentType.Button]: MousePointer,
    [BuilderComponentType.Image]: ImageIcon,
    [BuilderComponentType.Section]: LayoutPanelTop, 
    [BuilderComponentType.Container]: BoxSelect,
    [BuilderComponentType.Columns]: Columns,
    [BuilderComponentType.Grid]: Grid3X3, // Using Grid3X3 for simple Grid
    [BuilderComponentType.FlexContainer]: AlignJustify, // Icon for Flex Container
    [BuilderComponentType.GridContainer]: LayoutGrid, // Icon for Grid Container
    [BuilderComponentType.Video]: Youtube, // Icon for Video
    [BuilderComponentType.Icon]: Zap, // Generic icon for Icon component itself
    [BuilderComponentType.Divider]: () => <div className="w-full h-px bg-theme-text-muted my-1"></div>, // Custom render for divider
    [BuilderComponentType.Spacer]: () => <div className="w-full h-2"></div>, // Custom render for spacer
  }[item.type] || Box; // Default icon

  if (gridLayout) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="group cursor-grab active:cursor-grabbing"
      >
        <div className="bg-theme-bg-tertiary border border-theme-border-primary rounded-xl p-4 hover:border-theme-accent-primary/50 hover:shadow-lg hover:shadow-theme-accent-primary/10 transition-all duration-200 relative">
          <div className={`w-8 h-8 bg-gradient-to-br from-${item.type === BuilderComponentType.Text ? 'blue-400 to-blue-600' : item.type === BuilderComponentType.Heading ? 'purple-400 to-purple-600' : 'gray-400 to-gray-600'} rounded-lg flex items-center justify-center mb-3`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-theme-text-primary text-sm font-medium mb-1 truncate">{item.name}</h4>
          <p className="text-theme-text-muted text-xs truncate">{(item.defaultProps?.description as string) || `Draggable ${item.type}`}</p>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={`w-2 h-2 bg-${item.type === BuilderComponentType.Text ? 'blue-400' : item.type === BuilderComponentType.Heading ? 'purple-400' : 'gray-400'} rounded-full`}></div>
          </div>
        </div>
      </div>
    );
  }

  // List layout (default or if gridLayout is false)
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="group cursor-grab active:cursor-grabbing"
    >
      <div className="bg-theme-bg-tertiary border border-theme-border-primary rounded-xl p-4 hover:border-theme-accent-primary/50 hover:shadow-lg hover:shadow-theme-accent-primary/10 transition-all duration-200">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br from-${item.type === BuilderComponentType.Text ? 'blue-400 to-blue-600' : item.type === BuilderComponentType.Heading ? 'purple-400 to-purple-600' : 'gray-400 to-gray-600'} rounded-xl flex items-center justify-center`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-theme-text-primary font-semibold">{item.name}</h4>
            <p className="text-theme-text-muted text-xs">{(item.defaultProps?.description as string) || `Draggable ${item.type} component`}</p>
          </div>
          <div className="text-theme-accent-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};


const availablePaletteItems: PaletteItem[] = [
  { id: 'txt', type: BuilderComponentType.Text, name: 'Text', isPaletteItem: true, defaultWidth: 200, defaultHeight: 40, defaultProps: { text: 'Enter text...', description: "Paragraphs & content" } },
  { id: 'hdg', type: BuilderComponentType.Heading, name: 'Heading', isPaletteItem: true, defaultWidth: 250, defaultHeight: 50, defaultProps: { level: 'h1', text: 'Main Heading', description: "H1 to H6 headings" } },
  { id: 'btn', type: BuilderComponentType.Button, name: 'Button', isPaletteItem: true, defaultWidth: 120, defaultHeight: 40, defaultProps: { text: 'Click Me', variant: 'primary', description: "Interactive buttons" } },
  { id: 'img', type: BuilderComponentType.Image, name: 'Image', isPaletteItem: true, defaultWidth: 150, defaultHeight: 150, defaultProps: { src: '', alt: 'Placeholder', description: "Photos and graphics" } },
  { id: 'icn', type: BuilderComponentType.Icon, name: 'Icon', isPaletteItem: true, defaultWidth: 30, defaultHeight: 30, defaultProps: { iconName: 'LucideStar', description: "Vector icons" } },
  { id: 'div', type: BuilderComponentType.Divider, name: 'Divider', isPaletteItem: true, defaultWidth: '100%', defaultHeight: 2, defaultProps: { description: "Horizontal separator" } },
  { id: 'spc', type: BuilderComponentType.Spacer, name: 'Spacer', isPaletteItem: true, defaultWidth: 100, defaultHeight: 20, defaultProps: { description: "Empty spacing block" } },
  
  { id: 'sec', type: BuilderComponentType.Section, name: 'Section', isPaletteItem: true, defaultWidth: '100%', defaultHeight: 200, defaultProps: { description: "Full-width content block" } },
  { id: 'cnt', type: BuilderComponentType.Container, name: 'Container', isPaletteItem: true, defaultWidth: 300, defaultHeight: 100, defaultProps: { description: "Flexible content wrapper" } },
  { id: 'flx', type: BuilderComponentType.FlexContainer, name: 'Flex Container', isPaletteItem: true, defaultWidth: '100%', defaultHeight: 150, defaultProps: { description: "Flexible box layout", style: { display: 'flex', flexDirection: 'row' } } },
  { id: 'grc', type: BuilderComponentType.GridContainer, name: 'Grid Container', isPaletteItem: true, defaultWidth: '100%', defaultHeight: 200, defaultProps: { description: "Advanced grid layout", style: { display: 'grid' } } },
  { id: 'col', type: BuilderComponentType.Columns, name: 'Columns', isPaletteItem: true, defaultWidth: '100%', defaultHeight: 150, defaultProps: { description: "Multi-column layouts" } },
  { id: 'grd', type: BuilderComponentType.Grid, name: 'Grid', isPaletteItem: true, defaultWidth: 300, defaultHeight: 200, defaultProps: { description: "CSS Grid structure" } },
  { id: 'vid', type: BuilderComponentType.Video, name: 'Video', isPaletteItem: true, defaultWidth: 300, defaultHeight: 200, defaultProps: { src: '', description: "Embed videos", style: { backgroundColor: '#333' } } },
];

// Props for search, categories, etc. will be added later
type PrototiesProps = Record<string, never>; 

const Prototies: React.FC<PrototiesProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All"); // "All", "Layout", "Forms", "Media"
  const [gridLayout, setGridLayout] = useState(true); // Default to grid view

  // TODO: Implement actual filtering based on searchTerm and activeTab
  const filteredItems = availablePaletteItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryItems = (category: string): PaletteItem[] => {
    if (category === "All") return filteredItems;
    // This is a simplified categorization. A more robust system would involve tags or explicit categories on items.
    if (category === "Layout") return filteredItems.filter(item => [BuilderComponentType.Section, BuilderComponentType.Container, BuilderComponentType.FlexContainer, BuilderComponentType.GridContainer, BuilderComponentType.Columns, BuilderComponentType.Grid, BuilderComponentType.Spacer, BuilderComponentType.Divider].includes(item.type));
    if (category === "Basic") return filteredItems.filter(item => [BuilderComponentType.Text, BuilderComponentType.Heading, BuilderComponentType.Button, BuilderComponentType.Image, BuilderComponentType.Icon, BuilderComponentType.Video].includes(item.type)); // Added Video to Basic
    // Add more categories like "Forms", "Media"
    return [];
  }
  
  const currentCategoryItems = getCategoryItems(activeTab); // Use activeTab directly


  return (
    <div className="w-80 bg-theme-bg-primary border-r border-theme-border-primary flex flex-col h-full overflow-hidden"> {/* Added overflow-hidden */}
      {/* Header with Search */}
      <div className="p-6 border-b border-theme-border-primary">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-theme-text-primary">Components</h2>
          <button 
            onClick={() => setGridLayout(prev => !prev)}
            className="p-2 text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-tertiary rounded-lg"
            title={gridLayout ? "Switch to List View" : "Switch to Grid View"}
          >
            <Grid3X3 className="w-4 h-4" /> {/* Icon could change based on state */}
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-muted w-4 h-4" />
          <input
            className="w-full bg-theme-bg-secondary border border-theme-border-primary rounded-lg pl-10 pr-4 py-2.5 text-theme-text-primary placeholder-theme-text-muted focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="px-2 py-0.5 text-xs text-gray-400 bg-gray-700 rounded border border-gray-600">
              ⌘K
            </kbd>
          </div> */}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-6 py-4 border-b border-theme-border-primary">
        <div className="flex space-x-1 bg-theme-bg-secondary rounded-lg p-1">
          {["All", "Basic", "Layout" /*, "Forms", "Media" */].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2 text-sm rounded-md font-medium transition-all ${activeTab === tab ? 'text-theme-accent-primary bg-theme-accent-primary/10' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Component Grid/List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className={gridLayout ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {currentCategoryItems.map(item => (
            <DraggablePaletteItem key={item.id} item={item} gridLayout={gridLayout} />
          ))}
        </div>
        {currentCategoryItems.length === 0 && (
          <p className="text-center text-theme-text-muted text-sm mt-8">No components found.</p>
        )}
      </div>

      {/* Footer with Stats (Optional) */}
      <div className="p-4 border-t border-theme-border-primary bg-theme-bg-primary/50">
        <div className="flex items-center justify-between text-xs text-theme-text-muted">
          <span>{availablePaletteItems.length} Components</span>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-theme-accent-success rounded-full"></div>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prototies;
