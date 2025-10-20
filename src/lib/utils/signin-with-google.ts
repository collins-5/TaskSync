import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import client from '~/lib/graphql/apolloClient';
import {
  GetLoginWithGoogleRedirectUrlDocument,
  LoginWithGoogleDocument,
  LoginWithGoogleMutation,
  LoginWithGoogleMutationVariables,
} from '~/lib/graphql/generated/graphql';
import { useSessionStore } from '~/lib/store';

export async function loginWithGoogle(
  router: ReturnType<typeof useRouter>,
  refetchGetProfiles: () => void
) {
  try {
    const redirectUri = getRedirectUri();
    const authUrl = await fetchGoogleAuthUrl();
    const resultUrl = await launchAuthSession(authUrl, redirectUri);
    const authCode = extractCodeFromRedirect(resultUrl);
    const loginData = await exchangeCodeForToken(authCode);
    setSession(loginData);
    router.replace('/(protected)/(profiles)');
    refetchGetProfiles();
  } catch (error) {
    handleLoginError(error);
    throw error;
  }
}

function getRedirectUri(): string {
  return AuthSession.makeRedirectUri({
    scheme: 'react-native-rastuc-patient-app',
    path: 'redirect',
  });
}

async function fetchGoogleAuthUrl(): Promise<string> {
  const { data } = await client.mutate({ mutation: GetLoginWithGoogleRedirectUrlDocument });
  const url = data?.loginWithGoogle?.redirectUrl;
  if (!url) throw new Error('Failed to get Google auth URL from backend');
  return url;
}

async function launchAuthSession(authUrl: string, redirectUri: string): Promise<string> {
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
  if (result.type !== 'success' || !result.url) {
    throw new Error('Authentication cancelled or failed');
  }
  return result.url;
}

function extractCodeFromRedirect(url: string): string {
  const { queryParams } = Linking.parse(url);
  const code = Array.isArray(queryParams?.code) ? queryParams.code[0] : queryParams?.code;
  if (!code) throw new Error('No code returned from Google OAuth redirect');
  return code;
}

async function exchangeCodeForToken(code: string): Promise<LoginWithGoogleMutation> {
  const { data } = await client.mutate<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>({
    mutation: LoginWithGoogleDocument,
    variables: { code },
  });
  if (!data?.loginWithGoogle) throw new Error('Failed to login with Google');
  return data;
}

function setSession(data: LoginWithGoogleMutation) {
  const loginResult = data.loginWithGoogle?.loginResult;
  if (!loginResult || !loginResult.user) throw new Error('Incomplete login result from backend');

  useSessionStore.getState().setSession({
    email: '',
    profileId: null,
    userId: loginResult.user.id!,
    jwt: loginResult.jwtToken!,
    isEmailVerified: loginResult.isEmailVerified!,
    isPhoneNumberVerified: loginResult.isPhoneNumberVerified!,
    phoneNumber: loginResult.user.phoneNumber!,
  });
}

function handleLoginError(error: unknown) {
  console.error('Google login failed:', error);
}
