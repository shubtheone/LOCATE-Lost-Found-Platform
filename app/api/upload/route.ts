import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';

// Creates a unique, URL-friendly ID
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
);

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: "Missing filename or file body" },
      { status: 400 }
    );
  }
  
  // Vercel Blob needs a pathname for the file. 
  // We'll create a unique one to avoid name clashes.
  const randomId = nanoid();
  const uniquePathname = `${randomId}-${filename}`;

  try {
    const blob = await put(uniquePathname, request.body, {
      access: 'public',
    });

    // Return the blob object which contains the URL
    return NextResponse.json(blob);

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
        { error: "Failed to upload file to storage." },
        { status: 500 }
      );
  }
}