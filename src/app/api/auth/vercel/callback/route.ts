import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  // const error = searchParams.get('error');
  // const errorDescription = searchParams.get('error_description');

  // TODO: Retrieve the original state stored in a cookie or session
  // const originalState = request.cookies.get('vercel_oauth_state')?.value;
  // if (!state || state !== originalState) {
  //   console.error('Invalid OAuth state parameter.');
  //   return NextResponse.json({ error: 'Invalid state. CSRF attack suspected.' }, { status: 403 });
  // }
  // Clear the state cookie after verification
  // response.cookies.delete('vercel_oauth_state');

  if (!code) {
    // Handle cases where 'code' is not present (e.g., user denied access)
    const error = searchParams.get('error') || 'unknown_error';
    const errorDescription = searchParams.get('error_description') || 'User did not grant authorization or an error occurred.';
    console.error(`OAuth Error: ${error}, Description: ${errorDescription}`);
    // Redirect to an error page or show a message
    const appErrorUrl = new URL('/builder', request.nextUrl.origin); // Redirect to builder or a specific error page
    appErrorUrl.searchParams.append('oauth_error', error);
    appErrorUrl.searchParams.append('oauth_error_description', errorDescription);
    return NextResponse.redirect(appErrorUrl.toString());
  }

  const vercelClientId = process.env.VERCEL_CLIENT_ID || 'YOUR_VERCEL_CLIENT_ID_PLACEHOLDER';
  const vercelClientSecret = process.env.VERCEL_CLIENT_SECRET || 'YOUR_VERCEL_CLIENT_SECRET_PLACEHOLDER';
  const redirectUri = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/vercel/callback`
    : 'http://localhost:3001/api/auth/vercel/callback';

  if (vercelClientId === 'YOUR_VERCEL_CLIENT_ID_PLACEHOLDER' || vercelClientSecret === 'YOUR_VERCEL_CLIENT_SECRET_PLACEHOLDER') {
    console.error('Vercel Client ID or Client Secret is not configured.');
    return NextResponse.json(
      { error: 'Vercel integration (callback) is not configured correctly by the application owner.' },
      { status: 500 }
    );
  }

  try {
    const tokenResponse = await fetch('https://api.vercel.com/v2/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: vercelClientId,
        client_secret: vercelClientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code', // Though Vercel docs sometimes omit this, it's standard
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.json();
      console.error('Failed to exchange authorization code for access token:', errorBody);
      throw new Error(errorBody.error_description || errorBody.error || 'Token exchange failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    // const refreshToken = tokenData.refresh_token; // Vercel might not issue refresh tokens for all flows
    // const expiresIn = tokenData.expires_in;
    // const scope = tokenData.scope;
    // const tokenType = tokenData.token_type; // Should be 'Bearer'
    // const teamId = tokenData.team_id; // If applicable

    // TODO: Securely store the accessToken (and refreshToken if available)
    // For example, associate it with the user in your database, encrypted.
    // Or store in an HttpOnly, secure cookie if appropriate for your auth model.
    console.log('Vercel Access Token obtained:', accessToken);
    // console.log('Full token data:', tokenData);

    // For now, redirect to the builder page with a success query parameter
    const successUrl = new URL('/builder', request.nextUrl.origin);
    successUrl.searchParams.append('vercel_connected', 'true');
    
    // Example of setting token in a cookie (ensure HttpOnly, Secure, SameSite for production)
    const response = NextResponse.redirect(successUrl.toString());
    // response.cookies.set('vercel_access_token', accessToken, { 
    //   httpOnly: true, 
    //   secure: process.env.NODE_ENV === 'production', 
    //   path: '/', 
    //   maxAge: expiresIn || 3600 * 24 * 7 // e.g., 7 days
    // });
    return response;

  } catch (error) {
    console.error('Error in Vercel OAuth callback:', error);
    const appErrorUrl = new URL('/builder', request.nextUrl.origin);
    appErrorUrl.searchParams.append('oauth_error', 'token_exchange_failed');
    appErrorUrl.searchParams.append('oauth_error_description', error instanceof Error ? error.message : 'Could not obtain access token.');
    return NextResponse.redirect(appErrorUrl.toString());
  }
}
