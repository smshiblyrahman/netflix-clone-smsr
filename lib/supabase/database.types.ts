export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_status: string
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: string
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: string
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      mock_users: {
        Row: {
          id: number
          email: string
          full_name: string
          avatar_url: string | null
          subscription_status: string
          subscription_tier: string
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          full_name: string
          avatar_url?: string | null
          subscription_status?: string
          subscription_tier?: string
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          full_name?: string
          avatar_url?: string | null
          subscription_status?: string
          subscription_tier?: string
          created_at?: string
        }
      }
    }
  }
}
