import { CanvasComponentInstance, BuilderComponentType } from './types';
import { CSSProperties } from 'react';

/**
 * Converts a camelCased CSS property name to kebab-case.
 * e.g., fontSize -> font-size
 * @param camelCase - The camelCased string.
 * @returns The kebab-cased string.
 */
function camelToKebab(camelCase: string): string {
  return camelCase.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Generates a CSS string for a single component instance.
 * This will include converting inline styles and relevant props to CSS rules.
 * @param component - The CanvasComponentInstance to generate CSS for.
 * @returns A string containing CSS rules for this component.
 */
export function generateCSSForComponent(component: CanvasComponentInstance): string {
  let cssRules = '';
  const selector = `#component-${component.id}`; // Using ID selector

  // Convert component.style (CSSProperties) to CSS rules
  const inlineStyles: string[] = [];
  if (component.style) {
    for (const key in component.style) {
      if (Object.prototype.hasOwnProperty.call(component.style, key)) {
        const styleObject = component.style as Record<string, string | number | undefined>;
        const cssValue = styleObject[key];
        const cssProp = camelToKebab(key);

        if (typeof cssValue === 'string' || typeof cssValue === 'number') {
          // Handle numeric values that might need 'px' (common for CSSProperties)
          // More specific handling might be needed for unitless CSS properties
          const unitlessProps = ['zIndex', 'opacity', 'fontWeight', 'lineHeight', 'flexGrow', 'flexShrink', 'order', 'orphans', 'widows', 'zoom', 'animationIterationCount', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'fillOpacity', 'flex', 'gridArea', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'lineClamp', 'maskBorder', 'maskBorderOutset', 'maskBorderSlice', 'maskBorderWidth', 'shapeImageThreshold', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'tabSize', 'webkitLineClamp', 'webkitBoxOrdinalGroup', 'webkitBoxFlex'];
          const valueWithUnit = typeof cssValue === 'number' && !unitlessProps.includes(key)
            ? `${cssValue}px`
            : cssValue;
          inlineStyles.push(`  ${cssProp}: ${valueWithUnit};`);
        }
      }
    }
  }

  // Convert relevant component.props to CSS rules (e.g., text-align, custom colors not in style)
  // This part will expand based on how props are used for styling in PropertiesPanel
  // Example: if component.props.textAlign is used
  if (component.props.textAlign) {
    inlineStyles.push(`  text-align: ${component.props.textAlign};`);
  }
  // Example: if component.props.customBackgroundColor is used
  if (component.props.customBackgroundColor) {
    inlineStyles.push(`  background-color: ${component.props.customBackgroundColor};`);
  }

  // Add absolute positioning and dimensions
  // TODO: This is where the responsive conversion logic will be critical.
  // For V1, we'll stick to absolute positioning within a fixed container.
  inlineStyles.push(`  position: absolute;`);
  inlineStyles.push(`  left: ${component.left}px;`);
  inlineStyles.push(`  top: ${component.top}px;`);
  inlineStyles.push(`  width: ${component.width}px;`);
  inlineStyles.push(`  height: ${component.height}px;`);
  if (component.style?.zIndex !== undefined) {
    inlineStyles.push(`  z-index: ${component.style.zIndex};`);
  }


  if (inlineStyles.length > 0) {
    cssRules += `${selector} {\n${inlineStyles.join('\n')}\n}\n\n`;
  }

  return cssRules;
}

/**
 * Consolidates CSS for all components on a page.
 * @param allComponentsOnPage - Array of all CanvasComponentInstance on the page.
 * @returns An object containing globalCss and componentCss strings.
 */
export function consolidateStyles(allComponentsOnPage: CanvasComponentInstance[]): { componentCss: string } {
  let componentCss = '';

  allComponentsOnPage.forEach(component => {
    componentCss += generateCSSForComponent(component);
  });

  // globalCss will be handled separately, likely by copying/processing existing globals.css
  // and running Tailwind on generated HTML.
  return { componentCss };
}
