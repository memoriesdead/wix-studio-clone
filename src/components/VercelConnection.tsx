"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface VercelUser {
  email?: string;
  username?: string;
}

const VercelConnection: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [vercelUser, setVercelUser] = useState<VercelUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/vercel/status');
        if (!response.ok) {
          throw new Error(`Failed to fetch status: ${response.statusText}`);
        }
        const data = await response.json();
        setIsConnected(data.isConnected);
        if (data.isConnected && data.user) {
          setVercelUser(data.user);
        }
      } catch (err) {
        console.error("Error checking Vercel connection status:", err);
        setError(err instanceof Error ? err.message : 'Could not check connection status.');
        setIsConnected(false); // Assume not connected on error
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();

    // Check for OAuth callback errors in URL (e.g. if redirected from callback)
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('oauth_error');
    const oauthErrorDescription = urlParams.get('oauth_error_description');
    if (oauthError) {
      setError(`Vercel Connection Error: ${oauthError} - ${oauthErrorDescription || 'Please try again.'}`);
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    const vercelConnected = urlParams.get('vercel_connected');
    if (vercelConnected === 'true' && !isConnected) { // If status hasn't updated yet
        setIsConnected(true); // Optimistically update
        checkStatus(); // Re-check status to get user info
        window.history.replaceState({}, document.title, window.location.pathname);
    }


  }, [isConnected]); // Added isConnected to dependency array

  const handleConnect = () => {
    // Redirect to the backend route that initiates Vercel OAuth
    window.location.href = '/api/auth/vercel/connect';
  };

  // TODO: Implement disconnect functionality
  // const handleDisconnect = async () => {
  //   // Call an API route to clear the Vercel token (e.g., clear cookie)
  //   // await fetch('/api/auth/vercel/disconnect', { method: 'POST' });
  //   // setIsConnected(false);
  //   // setVercelUser(null);
  // };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Checking Vercel connection...</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 p-2 bg-red-100 border border-red-500 rounded-md">
        <p><strong>Connection Error:</strong> {error}</p>
        {!isConnected && (
            <Button onClick={handleConnect} variant="outline" size="sm" className="mt-2">
             Try Connecting to Vercel Again
            </Button>
        )}
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="text-sm text-green-600">
        Connected to Vercel
        {vercelUser && vercelUser.username && ` as ${vercelUser.username}`}
        {/* TODO: Add Disconnect button here */}
        {/* <Button onClick={handleDisconnect} variant="outline" size="sm" className="ml-2">Disconnect</Button> */}
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} variant="default" size="sm">
      Connect to Vercel
    </Button>
  );
};

export default VercelConnection;
