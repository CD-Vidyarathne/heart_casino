import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.'
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

async function getSupabaseClientWithSession(
  session: { access_token: string; refresh_token?: string }
): Promise<SupabaseClient> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.'
    );
  }

  const client = createClient(supabaseUrl, supabaseKey);
  // Set the session for this client - setSession is async
  try {
    await client.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token || '',
    });
  } catch (error) {
    console.error('Failed to set session on Supabase client:', error);
    throw error;
  }

  return client;
}

export class AuthService {
  private supabaseClient: SupabaseClient | null = null;

  private get supabase() {
    if (!this.supabaseClient) {
      this.supabaseClient = getSupabaseClient();
    }
    return this.supabaseClient;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // The session is automatically set on the client after signIn
    // This ensures getSession() will work correctly
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async updateProfile(
    userId: string,
    profileData: {
      display_name: string;
      gender: string;
      avatar: string;
    },
    session?: { access_token: string; refresh_token?: string }
  ) {
    // If session is provided, set it on the client for this request
    const client = session
      ? await getSupabaseClientWithSession(session)
      : this.supabase;

    const { data, error } = await client.from('profiles').upsert(
      {
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    );

    if (error) {
      console.error('Supabase profile update error:', error);
      throw error;
    }
    return data;
  }
}

export const authService = new AuthService();
