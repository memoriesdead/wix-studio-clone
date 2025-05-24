import { CanvasComponentInstance, PageData, BuilderComponentType } from './types';

// Represents a node in the component hierarchy tree
export interface ComponentTreeNode {
  component: CanvasComponentInstance;
  children: ComponentTreeNode[];
}

/**
 * Converts a flat array of canvas components into a hierarchical tree structure.
 * @param components - The flat array of CanvasComponentInstance.
 * @returns An array of root ComponentTreeNode objects.
 */
export function buildComponentTree(components: CanvasComponentInstance[]): ComponentTreeNode[] {
  const componentMap = new Map<string, CanvasComponentInstance>();
  const treeNodeMap = new Map<string, ComponentTreeNode>();
  const roots: ComponentTreeNode[] = [];

  components.forEach(component => {
    componentMap.set(component.id, component);
    treeNodeMap.set(component.id, { component, children: [] });
  });

  components.forEach(component => {
    const node = treeNodeMap.get(component.id)!;
    if (component.parentId && treeNodeMap.has(component.parentId)) {
      const parentNode = treeNodeMap.get(component.parentId)!;
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

/**
 * Generates an HTML string for a single component node and its children.
 * @param node - The ComponentTreeNode to generate HTML for.
 * @param allPages - Array of all pages in the project, for link resolution.
 * @returns The HTML string for the component.
 */
export function generateHTMLForComponent(node: ComponentTreeNode, allPages: PageData[]): string {
  const component = node.component;
  const props = component.props || {};
  const id = `component-${component.id}`;
  // Use component.className directly if it exists, otherwise fallback to props.className or empty string
  const userClassName = component.className || (typeof props.className === 'string' ? props.className : '');


  let childrenHTML = '';
  if (node.children && node.children.length > 0) {
    childrenHTML = node.children.map(childNode => generateHTMLForComponent(childNode, allPages)).join('\n    ');
  }

  let elementHTML = '';

  switch (component.type) {
    case BuilderComponentType.Text:
      elementHTML = `<p id="${id}" class="${userClassName}" data-component-type="${component.type}">${props.text || ''}</p>`;
      break;
    case BuilderComponentType.Heading:
      const level = props.level || 2;
      elementHTML = `<h${level} id="${id}" class="${userClassName}" data-component-type="${component.type}">${props.text || ''}</h${level}>`;
      break;
    case BuilderComponentType.Image:
      elementHTML = `<img id="${id}" class="${userClassName}" src="${props.src || ''}" alt="${props.alt || component.name}" data-component-type="${component.type}" />`;
      break;
    case BuilderComponentType.Button:
      const href = props.link || '#';
      const target = props.target || '_self';
      // Added a base "button" class for default button styling, userClassName for overrides/additions
      elementHTML = `<a id="${id}" href="${href}" target="${target}" class="button ${userClassName}" data-component-type="${component.type}" role="button">${props.text || 'Button'}</a>`;
      break;
    case BuilderComponentType.Container:
    case BuilderComponentType.Section:
    case BuilderComponentType.Columns:
    case BuilderComponentType.Grid:
    case BuilderComponentType.FlexContainer: // Added FlexContainer
    case BuilderComponentType.GridContainer: // Added GridContainer
      elementHTML = `<div id="${id}" class="${userClassName}" data-component-type="${component.type}">\n    ${childrenHTML}\n</div>`;
      break;
    case BuilderComponentType.Divider:
      elementHTML = `<hr id="${id}" class="${userClassName}" data-component-type="${component.type}" />`;
      break;
    case BuilderComponentType.Spacer:
      // Added a base "spacer" class
      elementHTML = `<div id="${id}" class="spacer ${userClassName}" data-component-type="${component.type}" style="height: ${props.height || '20'}px;"></div>`;
      break;
    case BuilderComponentType.Icon:
      // Added a base "icon" class
      elementHTML = `<div id="${id}" class="icon ${userClassName}" data-component-type="${component.type}"><!-- Icon: ${props.iconName || 'default'} --></div>`;
      break;
    case BuilderComponentType.Video:
      const videoSrc = typeof props.src === 'string' ? props.src : '';
      const videoWidth = typeof component.style?.width === 'string' || typeof component.style?.width === 'number' ? component.style.width : (component.width || 300);
      const videoHeight = typeof component.style?.height === 'string' || typeof component.style?.height === 'number' ? component.style.height : (component.height || 200);
      if (videoSrc) {
        // Basic YouTube embed URL transformation
        const embedSrc = videoSrc.includes('youtube.com/watch?v=') 
          ? videoSrc.replace('watch?v=', 'embed/') 
          : videoSrc.includes('youtu.be/')
            ? videoSrc.replace('youtu.be/', 'youtube.com/embed/')
            : videoSrc; // Assume other URLs might be directly embeddable or require different logic

        elementHTML = `<iframe id="${id}" class="video-iframe ${userClassName}" width="${videoWidth}" height="${videoHeight}" src="${embedSrc}" title="${component.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-component-type="${component.type}"></iframe>`;
      } else {
        elementHTML = `<div id="${id}" class="video-placeholder ${userClassName}" style="width:${videoWidth}px; height:${videoHeight}px; background-color:#ccc; display:flex; align-items:center; justify-content:center;" data-component-type="${component.type}"><span>Video Placeholder</span></div>`;
      }
      break;
    default:
      elementHTML = `<div id="${id}" class="${userClassName}" data-component-type="${component.type}">
  <!-- ${component.name} (${component.type}) -->
  ${props.text || ''}
  ${childrenHTML}
</div>`;
  }
  return elementHTML;
}

/**
 * Generates the full HTML document for a page.
 * @param pageTitle - The title of the page.
 * @param headContent - Additional content for the <head> tag (e.g., meta tags, links).
 * @param bodyContent - The main HTML content for the <body> tag.
 * @returns The complete HTML document string.
 */
export function generatePageHTML(pageTitle: string, headContent: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="../styles/globals.css">
  <link rel="stylesheet" href="../styles/components.css">
  ${headContent}
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}
