import { SupabaseClient } from '@supabase/supabase-js';
import {
  getSupabaseClient,
  getSupabaseClientWithSession,
  getSupabaseServiceClient,
} from '../../../lib/dbClient';

export class UserService {
  private supabaseClient: SupabaseClient | null = null;
  private serviceClient: SupabaseClient | null = null;

  private get supabase() {
    if (!this.supabaseClient) {
      this.supabaseClient = getSupabaseClient();
    }
    return this.supabaseClient;
  }

  private get service() {
    if (!this.serviceClient) {
      this.serviceClient = getSupabaseServiceClient();
    }
    return this.serviceClient;
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

  async updateBalance(
    userId: string,
    amount: number,
    operation: 'add' | 'subtract' | 'set',
    session?: { access_token: string; refresh_token?: string }
  ) {
    const client = this.service;

    const { data: profile, error: fetchError } = await client
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    console.log('Profile found:', profile);

    if (fetchError) {
      console.error('❌ Failed to fetch current balance:', fetchError);
      throw fetchError;
    }

    const currentBalance = profile?.balance || 0;
    let newBalance: number;

    switch (operation) {
      case 'add':
        newBalance = currentBalance + amount;
        break;
      case 'subtract':
        newBalance = Math.max(0, currentBalance - amount);
        break;
      case 'set':
        newBalance = amount;
        break;
      default:
        throw new Error('Invalid balance operation');
    }

    const { data, error } = await client
      .from('profiles')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update balance:', error);
      throw error;
    }

    console.log(
      `Balance updated: ${currentBalance} → ${newBalance} (${operation} ${amount})`
    );

    return data;
  }
}

export const userService = new UserService();
