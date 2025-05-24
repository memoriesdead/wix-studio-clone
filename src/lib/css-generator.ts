import { CanvasComponentInstance, BuilderComponentType, CSSProperties, ResponsiveStyles } from './types';

// Breakpoint configuration (could be moved to a central config)
const breakpoints = {
  tablet: '1024px',
  mobile: '768px',
};

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
 * Generates a string of CSS rules from a CSSProperties object.
 * @param styles - The CSSProperties object.
 * @returns A string of CSS rules, each on a new line and indented.
 */
function generateStyleBlock(styles?: CSSProperties): string {
  if (!styles) return '';
  const styleRules: string[] = [];
  const unitlessProps = ['zIndex', 'opacity', 'fontWeight', 'lineHeight', 'flexGrow', 'flexShrink', 'order', 'orphans', 'widows', 'zoom', 'animationIterationCount', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'fillOpacity', 'flex', 'gridArea', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'lineClamp', 'maskBorder', 'maskBorderOutset', 'maskBorderSlice', 'maskBorderWidth', 'shapeImageThreshold', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'tabSize', 'webkitLineClamp', 'webkitBoxOrdinalGroup', 'webkitBoxFlex'];

  for (const key in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, key)) {
      const cssValue = (styles as Record<string, string | number | undefined>)[key];
      const cssProp = camelToKebab(key);

      if (typeof cssValue === 'string' || typeof cssValue === 'number') {
        const valueWithUnit = typeof cssValue === 'number' && !unitlessProps.includes(key)
          ? `${cssValue}px`
          : cssValue;
        styleRules.push(`  ${cssProp}: ${valueWithUnit};`);
      }
    }
  }
  return styleRules.join('\n');
}

/**
 * Generates a CSS string for a single component instance, including responsive styles.
 * @param component - The CanvasComponentInstance to generate CSS for.
 * @returns A string containing CSS rules for this component.
 */
export function generateCSSForComponent(component: CanvasComponentInstance): string {
  let cssString = '';
  const selector = `#component-${component.id}`;

  // Base styles (desktop)
  const baseStylesArray: string[] = [];
  const desktopStyles = generateStyleBlock(component.style);
  if (desktopStyles) {
    baseStylesArray.push(desktopStyles);
  }

  // Add positioning and dimensions for components not primarily controlled by a parent layout container.
  // This logic will need to be more sophisticated. For now, if it's not a flex/grid container itself,
  // and doesn't have a parent that dictates layout, apply absolute positioning.
  // This is a simplification and will be refined.
  if (component.type !== BuilderComponentType.FlexContainer && component.type !== BuilderComponentType.GridContainer && !component.parentId) {
    baseStylesArray.push(`  position: absolute;`);
    baseStylesArray.push(`  left: ${component.left}px;`);
    baseStylesArray.push(`  top: ${component.top}px;`);
  }
  // Width and height are generally applicable, but might be overridden by flex/grid item properties.
  // If width/height are not in component.style, use the direct properties.
  if (!component.style?.width) baseStylesArray.push(`  width: ${component.width}px;`);
  if (!component.style?.height) baseStylesArray.push(`  height: ${component.height}px;`);


  // Convert relevant component.props to CSS rules (example)
  if (component.props?.textAlign) {
    baseStylesArray.push(`  text-align: ${component.props.textAlign};`);
  }
  if (component.props?.customBackgroundColor) {
    baseStylesArray.push(`  background-color: ${component.props.customBackgroundColor};`);
  }


  if (baseStylesArray.length > 0) {
    cssString += `${selector} {\n${baseStylesArray.join('\n')}\n}\n\n`;
  }

  // Responsive Styles
  if (component.responsiveStyles) {
    // Tablet Styles
    if (component.responsiveStyles.tablet) {
      const tabletStyleBlock = generateStyleBlock(component.responsiveStyles.tablet);
      if (tabletStyleBlock) {
        cssString += `@media (max-width: ${breakpoints.tablet}) {\n`;
        cssString += `  ${selector} {\n${tabletStyleBlock}\n  }\n`;
        cssString += `}\n\n`;
      }
    }
    // Mobile Styles
    if (component.responsiveStyles.mobile) {
      const mobileStyleBlock = generateStyleBlock(component.responsiveStyles.mobile);
      if (mobileStyleBlock) {
        cssString += `@media (max-width: ${breakpoints.mobile}) {\n`;
        cssString += `  ${selector} {\n${mobileStyleBlock}\n  }\n`;
        cssString += `}\n\n`;
      }
    }
  }

  return cssString;
}

/**
 * Consolidates CSS for all components.
 * @param allComponents - Array of all CanvasComponentInstance.
 * @returns An object containing componentCss string.
 */
export function consolidateStyles(allComponents: CanvasComponentInstance[]): { componentCss: string } {
  let componentCss = '/* Component-specific styles */\n\n';

  allComponents.forEach(component => {
    componentCss += generateCSSForComponent(component);
  });

  return { componentCss };
}
