import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // For generating a state parameter

export async function GET(request: Request) {
  const vercelClientId = process.env.VERCEL_CLIENT_ID || 'YOUR_VERCEL_CLIENT_ID_PLACEHOLDER';
  
  // IMPORTANT: Replace 'YOUR_VERCEL_CLIENT_ID_PLACEHOLDER' with your actual Vercel Client ID.
  // You should store this in an environment variable (e.g., VERCEL_CLIENT_ID).
  if (vercelClientId === 'YOUR_VERCEL_CLIENT_ID_PLACEHOLDER') {
    console.error('Vercel Client ID is not configured. Please set VERCEL_CLIENT_ID environment variable.');
    // In a real app, you might redirect to an error page or return a more user-friendly error.
    return NextResponse.json(
      { error: 'Vercel integration is not configured correctly by the application owner.' },
      { status: 500 }
    );
  }

  const redirectUri = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/vercel/callback`
    : 'http://localhost:3001/api/auth/vercel/callback'; // Default for local dev

  const scopes = ['user', 'project:create', 'deployment:create'];
  const state = uuidv4(); // Generate a random state string for CSRF protection

  // Store state in a short-lived cookie or server-side session to verify later
  // For simplicity here, we're not showing cookie storage, but it's crucial for security.
  // Example using cookies:
  // const response = NextResponse.redirect(authorizationUrl);
  // response.cookies.set('vercel_oauth_state', state, { path: '/', httpOnly: true, maxAge: 300 }); // 5 minutes
  // return response;
  // For now, we'll just redirect. State verification needs to be implemented in the callback.

  const authorizationUrl = new URL('https://vercel.com/oauth/authorize');
  authorizationUrl.searchParams.append('client_id', vercelClientId);
  authorizationUrl.searchParams.append('redirect_uri', redirectUri);
  authorizationUrl.searchParams.append('response_type', 'code');
  authorizationUrl.searchParams.append('scope', scopes.join(' '));
  authorizationUrl.searchParams.append('state', state); // Recommended for CSRF protection

  // Redirect the user to Vercel's authorization page
  return NextResponse.redirect(authorizationUrl.toString());
}
