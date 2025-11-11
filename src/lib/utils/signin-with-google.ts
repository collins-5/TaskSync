// lib/utils/signin-with-google.ts
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';
import { supabase } from '~/lib/utils/supabase';

WebBrowser.maybeCompleteAuthSession();

/** Build correct redirect URL */
function getRedirectUri(): string {
  if (Platform.OS === 'web') {
    return `${window.location.origin}/auth/callback`;
  }

  // DEV: use tunnel URL
  if (__DEV__) {
    const tunnel = process.env.EXPO_PUBLIC_TUNNEL_URL;
    if (tunnel) return `${tunnel}/auth/v1/callback`;
  }

  // PROD: use app scheme
  return 'tasksync://auth/v1/callback';
}

/** Trigger Google OAuth */
export async function signInWithGoogle(): Promise<boolean> {
  try {
    const redirectUri = getRedirectUri();
    console.log('Google OAuth →', redirectUri);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: false,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No URL from Supabase');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri, {
      preferEphemeralSession: false,
      showInRecents: true,
    });

    return result.type === 'success';
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    Alert.alert('Google Sign-In Failed', msg);
    return false;
  }
}

/** Deep link handler – inserts user into `users` table */
export function setupOAuthDeepLinkHandler(
  onSuccess: () => void,
  onError: (err: Error) => void,
  onUserCreated?: (user: any) => Promise<void>
): () => void {
  const handle = async (event: { url: string }) => {
    const { url } = event;
    if (!url.includes('auth/v1/callback')) return;

    try {
      const params = extract(url);
      if (params.error) throw new Error(params.error_description || params.error);

      let session;
      if (params.code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
        if (error) throw error;
        session = data.session;
      } else if (params.access_token && params.refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
        if (error) throw error;
        session = data.session;
      } else {
        throw new Error('No code/token');
      }

      // INSERT INTO `users` TABLE
      if (session?.user && onUserCreated) {
        await onUserCreated(session.user);
      }

      onSuccess();
    } catch (err) {
      onError(err as Error);
    }
  };

  const sub = Linking.addEventListener('url', handle);
  Linking.getInitialURL().then(url => {
    if (url) {
      void handle({ url });
    }
  });
  return () => sub.remove();
}

/** Helper: extract query/fragment params */
function extract(url: string): Record<string, string> {
  const out: Record<string, string> = {};
  const parsed = Linking.parse(url);

  if (url.includes('#')) {
    new URLSearchParams(url.split('#')[1]).forEach((v, k) => (out[k] = v));
  }

  if (parsed.queryParams) {
    Object.entries(parsed.queryParams).forEach(([k, v]) => {
      out[k] = Array.isArray(v) ? v[0] : v || '';
    });
  }

  return out;
}