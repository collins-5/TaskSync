// lib/utils/supabase.ts
import 'react-native-url-polyfill/auto';               // <-- must be first
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import * as SecureStore from 'expo-secure-store';

// ---- env validation -------------------------------------------------
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
}

// ---- SecureStore → Supabase Storage adapter -------------------------
const secureStorageAdapter = {
    getItem: async (key: string) => SecureStore.getItemAsync(key),
    setItem: async (key: string, value: string) =>
        SecureStore.setItemAsync(key, value),
    removeItem: async (key: string) => SecureStore.deleteItemAsync(key),
};

// ---- Supabase client ------------------------------------------------
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: secureStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export default supabase;