import { SupabaseClient } from '@supabase/supabase-js';
import {
  getSupabaseClient,
  getSupabaseClientWithSession,
  getSupabaseServiceClient,
} from '../../../lib/dbClient';
import type {
  GameHistoryRecord,
  GameHistoryStats,
  CreateGameHistoryRequest,
} from '../../../shared/gameHistoryTypes';

export class GameHistoryService {
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

  async createGameRecord(
    request: CreateGameHistoryRequest,
    session?: { access_token: string; refresh_token?: string }
  ): Promise<GameHistoryRecord> {
    console.log('🔍 SERVICE - Received request:', request);
    console.log('🔍 SERVICE - Field types:', {
      user_id: typeof request.user_id,
      score: typeof request.score,
      opponent_score: typeof request.opponent_score,
    });

    const client = this.service;

    const { data, error } = await client
      .from('game_history')
      .insert({
        user_id: request.user_id,
        game_type: request.game_type,
        result: request.result,
        score: request.score,
        opponent_score: request.opponent_score,
        duration: request.duration,
        chips_won: request.chips_won,
        chips_lost: request.chips_lost,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create game record:', error);
      throw error;
    }

    return data;
  }

  async getUserHistory(
    userId: string,
    gameType?: 'blackjack' | 'heart-game',
    limit: number = 50,
    session?: { access_token: string; refresh_token?: string }
  ): Promise<GameHistoryRecord[]> {
    const client = session
      ? await getSupabaseClientWithSession(session)
      : this.supabase;

    let query = client
      .from('game_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch game history:', error);
      throw error;
    }

    return data || [];
  }

  async getUserStats(
    userId: string,
    session?: { access_token: string; refresh_token?: string }
  ): Promise<GameHistoryStats> {
    const client = session
      ? await getSupabaseClientWithSession(session)
      : this.supabase;

    const { data, error } = await client
      .from('game_history')
      .select('result, chips_won, chips_lost')
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to fetch game stats:', error);
      throw error;
    }

    const stats: GameHistoryStats = {
      totalGames: data.length,
      wins: 0,
      losses: 0,
      ties: 0,
      chipsWon: 0,
      chipsLost: 0,
    };

    data.forEach((record) => {
      if (record.result === 'win') stats.wins++;
      else if (record.result === 'loss') stats.losses++;
      else if (record.result === 'tie') stats.ties++;

      stats.chipsWon += record.chips_won;
      stats.chipsLost += record.chips_lost;
    });

    return stats;
  }
}

export const gameHistoryService = new GameHistoryService();
