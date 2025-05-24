import { CanvasComponentInstance, PageData, ProjectData, BuilderComponentType } from './types';
import { buildComponentTree, generateHTMLForComponent, generatePageHTML, ComponentTreeNode } from './html-generator';
import { consolidateStyles } from './css-generator';
import { processAssets, Asset } from './asset-processor';
// import fs from 'fs/promises'; // For writing files if run in Node.js environment
// import path from 'path'; // For path manipulation

// Describes a file to be generated as part of the static site
export interface GeneratedFile {
  path: string; // Relative path in the output directory (e.g., 'index.html', 'styles/main.css')
  content: string | Buffer; // File content
}

/**
 * Generates the static site files for a single page.
 * @param pageData - The data for the page to generate.
 * @param allPages - Array of all pages in the project, for link resolution.
 * @returns A promise that resolves to an array of GeneratedFile objects for this page.
 */
async function generateFilesForPage(pageData: PageData, allPages: PageData[]): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];

  // 1. Build component tree
  const componentTreeRoots = buildComponentTree(pageData.components);

  // 2. Generate HTML content for the body
  let bodyContent = '';
  componentTreeRoots.forEach(rootNode => {
    bodyContent += generateHTMLForComponent(rootNode, allPages);
  });

  // 3. Generate full page HTML
  // For the main page (e.g., path '/'), output to index.html. For others (e.g., '/about'), output to 'about/index.html'.
  const pageHtmlPath = pageData.path === '/' ? 'index.html' : `${pageData.path.substring(1)}/index.html`;
  const pageHtml = generatePageHTML(pageData.name, '', bodyContent); // headContent can be added later
  files.push({ path: pageHtmlPath, content: pageHtml });

  // 4. Consolidate CSS for this page
  // In a multi-page site, component CSS might be per-page or global.
  // For now, let's assume componentCss is generated per page and linked.
  // However, the current generatePageHTML links to global ../styles/components.css
  // This implies componentCss should be aggregated globally.
  // Let's stick to the plan of one components.css for now.
  // The consolidateStyles function will be called once with ALL components from ALL pages.

  // 5. Process assets for this page (assets are typically global)
  // Asset processing should ideally happen once for the entire project.

  return files;
}


/**
 * Main orchestrator for generating the entire static site from project data.
 * @param projectData - The full project data.
 * @returns A promise that resolves to an array of GeneratedFile objects.
 */
export async function generateStaticSite(projectData: ProjectData): Promise<GeneratedFile[]> {
  const allGeneratedFiles: GeneratedFile[] = [];
  let allComponentsFromAllPages: CanvasComponentInstance[] = [];

  projectData.pages.forEach(page => {
    allComponentsFromAllPages = allComponentsFromAllPages.concat(page.components);
  });

  // 1. Generate HTML for each page
  for (const page of projectData.pages) {
    const pageFiles = await generateFilesForPage(page, projectData.pages);
    allGeneratedFiles.push(...pageFiles);
  }

  // 2. Consolidate all component-specific CSS
  const { componentCss } = consolidateStyles(allComponentsFromAllPages);
  allGeneratedFiles.push({ 
    path: 'styles/components.css', 
    content: componentCss || '/* No component-specific styles generated. */' 
  });

  // 3. Process all assets (images, fonts)
  const assets = await processAssets(allComponentsFromAllPages);
  for (const asset of assets) {
    if (asset.content) { // Only add if content is available (i.e., local files to be copied)
      allGeneratedFiles.push({ path: asset.newPathInOutput, content: asset.content });
    }
    // Note: If asset.content is not present (e.g. external URLs or fonts handled by CSS link),
    // they are not added as separate files here. The HTML/CSS generators should use originalPathOrUrl.
    // The asset processor's role for fonts here is to ensure they are copied if local.
  }

  // 4. Add global styles
  // This content should ideally be the result of processing src/app/globals.css with Tailwind
  // For now, we'll use the raw content.
  const globalCssContent = `@import url('../styles/animations.css');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;

    /* Custom Colors */
    --wix-dark-blue: 228 18% 10%;
    --wix-light-gray: 200 20% 95%;
    --wix-accent-green: 65 72% 51%;
    --wix-text-gray: 213 12% 63%;
  }

  .dark {
    /* Dark Professional Theme */
    --bg-primary: #0f0f0f;
    --bg-secondary: #1a1a1a;
    --bg-tertiary: #2a2a2a;
    --bg-glass: rgba(255,255,255,0.05);

    --accent-primary: #00d4ff;
    --accent-secondary: #ff6b6b;
    --accent-success: #51cf66;
    --accent-warning: #ffd43b;

    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --text-muted: #666666;
    --text-accent: #00d4ff;

    --border-primary: rgba(255,255,255,0.1);
    --border-focus: rgba(0,212,255,0.5);
    --border-hover: rgba(255,255,255,0.2);

    /* Overwrite existing shadcn/ui dark theme variables */
    --background: var(--bg-primary); /* Typically main page background */
    --foreground: var(--text-primary); /* Typically main text color */
    
    --card: var(--bg-secondary); /* Card backgrounds */
    --card-foreground: var(--text-primary);
    
    --popover: var(--bg-tertiary); /* Popover backgrounds */
    --popover-foreground: var(--text-primary);
    
    --primary: var(--accent-primary); /* Primary interactive elements */
    --primary-foreground: var(--bg-primary); /* Text on primary elements */
    
    --secondary: var(--bg-tertiary); /* Secondary interactive elements */
    --secondary-foreground: var(--text-secondary);
    
    --muted: var(--bg-tertiary); /* Muted backgrounds */
    --muted-foreground: var(--text-muted);
    
    --accent: var(--accent-primary); /* Accent color for highlights */
    --accent-foreground: var(--bg-primary);
        
    --destructive: var(--accent-secondary); /* Destructive actions */
    --destructive-foreground: var(--text-primary);
    
    --border: var(--border-primary); /* Default border color */
    --input: var(--border-primary); /* Input border color */
    --ring: var(--border-focus); /* Focus ring color */
  }
}

@layer base {
  * {
    @apply border-border; /* Uses the CSS variable defined in :root or .dark */
  }
  body {
    @apply bg-background text-foreground; /* Uses CSS variables */
    /* For the builder specifically, we might want to force dark theme */
    /* or apply a specific class to the builder's root element */
  }
}

@layer utilities {
  .wix-container {
    @apply container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl;
  }

  .bg-wix-dark {
    @apply bg-[#111422];
  }

  .bg-wix-light {
    @apply bg-[#eef1f2];
  }

  .bg-wix-accent {
    @apply bg-[#d3e22d];
  }

  .text-wix-accent {
    @apply text-[#d3e22d];
  }

  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-[#d3e22d] to-[#9bbcd1];
  }

  .max-w-screen-content {
    @apply max-w-[1440px];
  }

  /* Advanced Visual Effects from prompt */
  .glass-panel {
    background: rgba(255, 255, 255, 0.05); /* Consider using var(--bg-glass) if defined */
    -webkit-backdrop-filter: blur(20px); /* Safari compatibility */
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1); /* Consider var(--border-primary) */
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .neuro-element {
    background: linear-gradient(145deg, #1e1e1e, #0a0a0a);
    box-shadow: 
      9px 9px 18px #070707,
      -9px -9px 18px #2d2d2d;
  }

  .gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .gradient-secondary {
    background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  }

  .animated-gradient {
    background: linear-gradient(
      -45deg, 
      var(--theme-accent-primary, #00d4ff), 
      var(--theme-accent-secondary, #ff6b6b), 
      var(--theme-accent-success, #51cf66), 
      var(--theme-accent-warning, #ffd43b)
    );
    background-size: 400% 400%;
    animation: gradientShift 4s ease infinite; /* Ensure gradientShift is in tailwind.config.ts */
  }

  /* Micro-interactions & Animations from prompt */
  /* Note: Many of these are better applied as utility classes or component-specific styles */
  .hover-lift {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .hover-lift:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 10px 25px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .action-button {
    position: relative;
    overflow: hidden;
  }
  .action-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }
  .action-button:hover::before {
    left: 100%;
  }

  .loading-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.0) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite; /* Ensure shimmer keyframes are defined */
  }

  /* Keyframes for shimmer if not in tailwind.config.ts (better there) */
  /* @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } } */

  /* Performance Optimization Classes */
  .gpu-accelerated {
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .smooth-scroll {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  .optimized-animation {
    will-change: transform, opacity;
  }

  .optimized-animation.complete {
    will-change: auto;
  }

  /* Slider thumb utility (example) */
  .slider-thumb::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
    /* Add other browser prefixes if needed */
  }
  .slider-thumb::-moz-range-thumb {
    @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-0;
  }

}

@font-face {
  font-family: 'MadeFor-Display';
  src: url('/fonts/madefor-display.woff2') format('woff2');
  font-weight: 300 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MadeFor-Text';
  src: url('/fonts/madefor-text.woff2') format('woff2');
  font-weight: 300 700;
  font-style: normal;
  font-display: swap;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'MadeFor-Display', sans-serif;
}

body, p, a, button, li, span {
  font-family: 'MadeFor-Text', sans-serif;
}
`;
  allGeneratedFiles.push({ 
    path: 'styles/globals.css', 
    content: globalCssContent
  });

  return allGeneratedFiles;
}

// Example of how to use this to write files (conceptual, depends on environment)
// async function writeGeneratedFiles(files: GeneratedFile[], outputDir: string): Promise<void> {
//   for (const file of files) {
//     const filePath = path.join(outputDir, file.path);
//     await fs.mkdir(path.dirname(filePath), { recursive: true });
//     await fs.writeFile(filePath, file.content);
//     console.log(`Generated: ${filePath}`);
//   }
// }
