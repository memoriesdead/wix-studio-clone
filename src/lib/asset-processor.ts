import { CanvasComponentInstance, BuilderComponentType } from './types';

// Describes an asset to be included in the generated site
export interface Asset {
  originalPathOrUrl: string; // The path/URL as it appears in component props
  newPathInOutput: string;   // The relative path in the 'assets/' directory of the output
  content?: Buffer;          // The actual file content, if it needs to be read and written
  type: 'image' | 'font' | 'other'; // Type of asset
}

/**
 * Scans components for assets (e.g., images) and prepares them for inclusion
 * in the static site output.
 * @param components - An array of CanvasComponentInstance to scan.
 * @returns A promise that resolves to an array of Asset objects.
 */
export async function processAssets(components: CanvasComponentInstance[]): Promise<Asset[]> {
  const assets: Asset[] = [];
  const processedUrls = new Set<string>(); // To avoid duplicate processing

  for (const component of components) {
    if (component.type === BuilderComponentType.Image && component.props.src) {
      const imageUrl = component.props.src as string;

      if (processedUrls.has(imageUrl)) {
        continue;
      }
      processedUrls.add(imageUrl);

      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('//')) {
        // External image, link directly
        // No asset to copy, but we could still list it if needed for inventory
      } else if (imageUrl.startsWith('/')) {
        // Local image (e.g., /uploads/my-image.png or /images/stock.jpg)
        // We need to determine its actual location in the project to read it.
        // For now, assume it's relative to a 'public' folder or similar.
        // The 'newPathInOutput' will be like 'assets/images/my-image.png'
        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        const newPath = `assets/images/${fileName}`;

        // TODO: Implement logic to actually read the file content from the project
        // This might involve knowing the base path of the project's public assets.
        // For example, if imageUrl is '/uploads/image.png', and the project's public
        // assets are in 'wix-studio-clone/public/', then we'd read 'wix-studio-clone/public/uploads/image.png'.
        // This part requires more context on how local assets are served/stored by the builder.
        // Construct the assumed original path relative to the project root.
        // This assumes 'public' is at 'wix-studio-clone/public'.
        const originalProjectPath = `wix-studio-clone/public${imageUrl}`; // e.g., wix-studio-clone/public/uploads/image.png

        assets.push({
          originalPathOrUrl: originalProjectPath, // Path for potential reading
          newPathInOutput: newPath,               // Path in the generated output
          // content remains undefined; to be populated by a reader if needed
          type: 'image',
        });
      }
    }
    // TODO: Add handling for other asset types, like custom fonts if specified in component props
  }

  // Add font files (assuming they are known and always included for now)
  const fontFiles = [
    { name: 'madefor-display.woff2', projectPath: 'wix-studio-clone/public/fonts/madefor-display.woff2' },
    { name: 'madefor-text.woff2', projectPath: 'wix-studio-clone/public/fonts/madefor-text.woff2' },
  ];

  for (const font of fontFiles) {
    // Use projectPath for processedUrls key to ensure uniqueness if names collide from different paths
    if (processedUrls.has(font.projectPath)) continue;
    processedUrls.add(font.projectPath);
    
    assets.push({
      originalPathOrUrl: font.projectPath, // Full path for potential reading
      newPathInOutput: `assets/fonts/${font.name}`,
      // content remains undefined; to be populated by a reader if needed
      type: 'font',
    });
  }


  return assets;
}

// Placeholder for a function that would read file content.
// In a real scenario, this might use Node.js 'fs' module if run in a Node environment,
// or fetch if assets are accessible via HTTP during generation.
// async function readFileFromServer(filePath: string): Promise<Buffer> {
//   // This is highly dependent on the execution environment of the site generator.
//   // If running server-side in Next.js API route, fs can be used.
//   // For now, this is a conceptual placeholder.
//   console.warn(`readFileFromServer: Reading of ${filePath} is not implemented yet.`);
//   return Buffer.from('');
// }
