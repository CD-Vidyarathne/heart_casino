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

async function getSupabaseClientWithSession(session: {
  access_token: string;
  refresh_token?: string;
}): Promise<SupabaseClient> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.'
    );
  }

  const client = createClient(supabaseUrl, supabaseKey);
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

export class UserService {
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

  async getUserProfile(
    userId: string,
    session?: { access_token: string; refresh_token?: string }
  ) {
    const client = session
      ? await getSupabaseClientWithSession(session)
      : this.supabase;

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Supabase profile fetch error:', error);
      throw error;
    }
    return data;
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

export const userService = new UserService();
