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
  // Intend to get className from props if it exists, otherwise empty string
  const className = typeof props.className === 'string' ? props.className : '';


  let childrenHTML = '';
  if (node.children && node.children.length > 0) {
    childrenHTML = node.children.map(childNode => generateHTMLForComponent(childNode, allPages)).join('\n    ');
  }

  let elementHTML = '';

  switch (component.type) {
    case BuilderComponentType.Text:
      elementHTML = `<p id="${id}" class="${className}" data-component-type="${component.type}">${props.text || ''}</p>`;
      break;
    case BuilderComponentType.Heading:
      // Assuming props.level (e.g., 1 for h1, 2 for h2) exists or defaulting to h2
      const level = props.level || 2;
      elementHTML = `<h${level} id="${id}" class="${className}" data-component-type="${component.type}">${props.text || ''}</h${level}>`;
      break;
    case BuilderComponentType.Image:
      // TODO: Asset processing will update src to point to the new path in 'assets/images/'
      // For now, using props.src directly. Alt text from props.alt.
      elementHTML = `<img id="${id}" class="${className}" src="${props.src || ''}" alt="${props.alt || component.name}" data-component-type="${component.type}" />`;
      break;
    case BuilderComponentType.Button:
      // TODO: Handle link resolution using allPages for internal links
      const href = props.link || '#';
      const target = props.target || '_self'; // e.g., _blank for new tab
      elementHTML = `<a id="${id}" href="${href}" target="${target}" class="button ${className}" data-component-type="${component.type}" role="button">${props.text || 'Button'}</a>`;
      // Or use <button> if it's not a link:
      // elementHTML = `<button id="${id}" class="button ${className}" data-component-type="${component.type}">${props.text || 'Button'}</button>`;
      break;
    case BuilderComponentType.Container:
    case BuilderComponentType.Section:
    case BuilderComponentType.Columns:
    case BuilderComponentType.Grid:
      elementHTML = `<div id="${id}" class="${className}" data-component-type="${component.type}">\n    ${childrenHTML}\n</div>`;
      break;
    case BuilderComponentType.Divider:
      elementHTML = `<hr id="${id}" class="${className}" data-component-type="${component.type}" />`;
      break;
    case BuilderComponentType.Spacer:
      elementHTML = `<div id="${id}" class="spacer ${className}" data-component-type="${component.type}" style="height: ${props.height || '20'}px;"></div>`; // Height from props
      break;
    case BuilderComponentType.Icon:
      // Icon handling would be more complex, potentially involving SVG strings or font icons
      elementHTML = `<div id="${id}" class="icon ${className}" data-component-type="${component.type}"><!-- Icon: ${props.iconName || 'default'} --></div>`;
      break;
    default:
      // Generic div for unknown or simple wrapper components
      elementHTML = `<div id="${id}" class="${className}" data-component-type="${component.type}">
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
