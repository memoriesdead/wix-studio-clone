import { NextResponse } from 'next/server';
import { ProjectData } from '@/lib/types'; // Assuming types.ts is in lib
import { generateStaticSite, GeneratedFile } from '@/lib/site-generator';
// import AdmZip from 'adm-zip'; // To return files as a ZIP

export async function POST(request: Request) {
  try {
    const projectData = (await request.json()) as ProjectData;

    if (!projectData || !projectData.pages || projectData.pages.length === 0) {
      return NextResponse.json({ error: 'Invalid project data provided.' }, { status: 400 });
    }

    // Generate the static site files (HTML, CSS, assets)
    const generatedFiles: GeneratedFile[] = await generateStaticSite(projectData);

    // For now, let's return the list of generated files and their content.
    // Later, we might want to zip them or provide a preview URL.
    // NOTE: Sending large file contents directly in JSON might be inefficient.
    // Consider returning paths or a manifest, and another endpoint to fetch individual files,
    // or zipping the content. For initial testing, this should be okay.

    // Simple response with file names and a snippet of content for brevity
    const responseFiles = generatedFiles.map(file => ({
      path: file.path,
      contentSnippet: typeof file.content === 'string' ? file.content.substring(0, 200) + '...' : `Buffer data (length: ${file.content.length})`,
      isBuffer: typeof file.content !== 'string',
    }));

    return NextResponse.json({ 
      message: 'Site generation successful (simulated).',
      fileCount: generatedFiles.length,
      files: responseFiles,
      // If you want to send full content (be careful with large sites):
      // fullFiles: generatedFiles.map(f => ({...f, content: typeof f.content === 'string' ? f.content : f.content.toString('base64')}))
    });

    /*
    // Example: Zipping files (requires adm-zip or similar)
    const zip = new AdmZip();
    for (const file of generatedFiles) {
      zip.addFile(file.path, Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, 'utf-8'));
    }
    const zipBuffer = zip.toBuffer();

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="generated-site.zip"`,
        'Content-Type': 'application/zip',
      },
    });
    */

  } catch (error) {
    console.error('Error generating site:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Site generation failed.', details: errorMessage }, { status: 500 });
  }
}
