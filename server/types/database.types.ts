export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          avatar_url: string | null
          bank_transfer_info: Json | null
          created_at: string | null
          crypto_deposit_methods: Json | null
          email: string
          faqs: Json | null
          full_name: string | null
          id: string
          investment_plans: Json | null
          is_active: boolean | null
          last_login_at: string | null
          last_login_ip: string | null
          p2p_deposit_methods: Json | null
          password: string
          staking_plans: Json | null
          subscription_plans: Json | null
          support_contacts: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bank_transfer_info?: Json | null
          created_at?: string | null
          crypto_deposit_methods?: Json | null
          email: string
          faqs?: Json | null
          full_name?: string | null
          id?: string
          investment_plans?: Json | null
          is_active?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          p2p_deposit_methods?: Json | null
          password: string
          staking_plans?: Json | null
          subscription_plans?: Json | null
          support_contacts?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bank_transfer_info?: Json | null
          created_at?: string | null
          crypto_deposit_methods?: Json | null
          email?: string
          faqs?: Json | null
          full_name?: string | null
          id?: string
          investment_plans?: Json | null
          is_active?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          p2p_deposit_methods?: Json | null
          password?: string
          staking_plans?: Json | null
          subscription_plans?: Json | null
          support_contacts?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          account_status: string | null
          account_tier: string | null
          active_investments: Json | null
          active_orders: Json | null
          active_positions: number | null
          address_line1: string | null
          address_line2: string | null
          admin_id: string | null
          annual_income_range: string | null
          avatar_url: string | null
          billing_cycle: string | null
          city: string | null
          copied_experts: Json | null
          copy_trading_positions: Json | null
          country: string | null
          created_at: string | null
          daily_trade_limit: number | null
          daily_withdrawal_limit: number | null
          date_of_birth: string | null
          deleted_at: string | null
          deposits: Json | null
          email: string
          email_verified: boolean | null
          email_verified_at: string | null
          employment_status: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          identity_document_expiry: string | null
          identity_document_number: string | null
          identity_document_type: string | null
          investment_experience: string | null
          investment_returns: number | null
          is_active: boolean | null
          is_banned: boolean | null
          is_suspended: boolean | null
          kyc_rejection_reason: string | null
          kyc_status: string | null
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          last_login_at: string | null
          last_login_ip: string | null
          last_name: string | null
          locked_until: string | null
          login_attempts: number | null
          marketing_emails_enabled: boolean | null
          monthly_withdrawal_limit: number | null
          net_worth_range: string | null
          newsletter_subscribed: boolean | null
          notes: string | null
          notifications: Json | null
          occupation: string | null
          order_history: Json | null
          otp_attempts: number | null
          otp_code: string | null
          otp_expires_at: string | null
          otp_is_used: boolean | null
          otp_type: string | null
          password: string
          phone: string | null
          plan_bonus: number | null
          politically_exposed: boolean | null
          portfolio_history: Json | null
          portfolio_holdings: Json | null
          portfolio_value: number | null
          postal_code: string | null
          preferred_currency: string | null
          preferred_language: string | null
          proof_of_address_verified: boolean | null
          referral_code: string | null
          referral_earnings: number | null
          referred_by_code: string | null
          registration_ip: string | null
          risk_tolerance: string | null
          role: string | null
          security_alerts_enabled: boolean | null
          selfie_verified: boolean | null
          source_of_funds: string | null
          staking_positions: Json | null
          state: string | null
          subscription_expires_at: string | null
          subscription_plan_name: string | null
          subscription_started_at: string | null
          subscription_status: string | null
          suspended_at: string | null
          suspended_until: string | null
          suspension_reason: string | null
          tags: string[] | null
          tax_code_pin: string | null
          tax_country: string | null
          tax_id_number: string | null
          timezone: string | null
          total_deposited: number | null
          total_invested: number | null
          total_rewards_earned: number | null
          total_trading_volume: number | null
          total_withdrawn: number | null
          trades: Json | null
          trading_experience: string | null
          trading_notifications_enabled: boolean | null
          transaction_history: Json | null
          transactions: Json | null
          two_factor_enabled: boolean | null
          two_factor_method: string | null
          updated_at: string | null
          user_agent: string | null
          username: string | null
          verification_documents: Json | null
          verification_level: string | null
          verification_status: string | null
          verified_at: string | null
          wallet_addresses: Json | null
          wallet_balance: number | null
          withdrawal_pin: string | null
          withdrawals: Json | null
        }
        Insert: {
          account_status?: string | null
          account_tier?: string | null
          active_investments?: Json | null
          active_orders?: Json | null
          active_positions?: number | null
          address_line1?: string | null
          address_line2?: string | null
          admin_id?: string | null
          annual_income_range?: string | null
          avatar_url?: string | null
          billing_cycle?: string | null
          city?: string | null
          copied_experts?: Json | null
          copy_trading_positions?: Json | null
          country?: string | null
          created_at?: string | null
          daily_trade_limit?: number | null
          daily_withdrawal_limit?: number | null
          date_of_birth?: string | null
          deleted_at?: string | null
          deposits?: Json | null
          email: string
          email_verified?: boolean | null
          email_verified_at?: string | null
          employment_status?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          identity_document_expiry?: string | null
          identity_document_number?: string | null
          identity_document_type?: string | null
          investment_experience?: string | null
          investment_returns?: number | null
          is_active?: boolean | null
          is_banned?: boolean | null
          is_suspended?: boolean | null
          kyc_rejection_reason?: string | null
          kyc_status?: string | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          last_login_at?: string | null
          last_login_ip?: string | null
          last_name?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          marketing_emails_enabled?: boolean | null
          monthly_withdrawal_limit?: number | null
          net_worth_range?: string | null
          newsletter_subscribed?: boolean | null
          notes?: string | null
          notifications?: Json | null
          occupation?: string | null
          order_history?: Json | null
          otp_attempts?: number | null
          otp_code?: string | null
          otp_expires_at?: string | null
          otp_is_used?: boolean | null
          otp_type?: string | null
          password: string
          phone?: string | null
          plan_bonus?: number | null
          politically_exposed?: boolean | null
          portfolio_history?: Json | null
          portfolio_holdings?: Json | null
          portfolio_value?: number | null
          postal_code?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          proof_of_address_verified?: boolean | null
          referral_code?: string | null
          referral_earnings?: number | null
          referred_by_code?: string | null
          registration_ip?: string | null
          risk_tolerance?: string | null
          role?: string | null
          security_alerts_enabled?: boolean | null
          selfie_verified?: boolean | null
          source_of_funds?: string | null
          staking_positions?: Json | null
          state?: string | null
          subscription_expires_at?: string | null
          subscription_plan_name?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          suspended_at?: string | null
          suspended_until?: string | null
          suspension_reason?: string | null
          tags?: string[] | null
          tax_code_pin?: string | null
          tax_country?: string | null
          tax_id_number?: string | null
          timezone?: string | null
          total_deposited?: number | null
          total_invested?: number | null
          total_rewards_earned?: number | null
          total_trading_volume?: number | null
          total_withdrawn?: number | null
          trades?: Json | null
          trading_experience?: string | null
          trading_notifications_enabled?: boolean | null
          transaction_history?: Json | null
          transactions?: Json | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string | null
          user_agent?: string | null
          username?: string | null
          verification_documents?: Json | null
          verification_level?: string | null
          verification_status?: string | null
          verified_at?: string | null
          wallet_addresses?: Json | null
          wallet_balance?: number | null
          withdrawal_pin?: string | null
          withdrawals?: Json | null
        }
        Update: {
          account_status?: string | null
          account_tier?: string | null
          active_investments?: Json | null
          active_orders?: Json | null
          active_positions?: number | null
          address_line1?: string | null
          address_line2?: string | null
          admin_id?: string | null
          annual_income_range?: string | null
          avatar_url?: string | null
          billing_cycle?: string | null
          city?: string | null
          copied_experts?: Json | null
          copy_trading_positions?: Json | null
          country?: string | null
          created_at?: string | null
          daily_trade_limit?: number | null
          daily_withdrawal_limit?: number | null
          date_of_birth?: string | null
          deleted_at?: string | null
          deposits?: Json | null
          email?: string
          email_verified?: boolean | null
          email_verified_at?: string | null
          employment_status?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          identity_document_expiry?: string | null
          identity_document_number?: string | null
          identity_document_type?: string | null
          investment_experience?: string | null
          investment_returns?: number | null
          is_active?: boolean | null
          is_banned?: boolean | null
          is_suspended?: boolean | null
          kyc_rejection_reason?: string | null
          kyc_status?: string | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          last_login_at?: string | null
          last_login_ip?: string | null
          last_name?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          marketing_emails_enabled?: boolean | null
          monthly_withdrawal_limit?: number | null
          net_worth_range?: string | null
          newsletter_subscribed?: boolean | null
          notes?: string | null
          notifications?: Json | null
          occupation?: string | null
          order_history?: Json | null
          otp_attempts?: number | null
          otp_code?: string | null
          otp_expires_at?: string | null
          otp_is_used?: boolean | null
          otp_type?: string | null
          password?: string
          phone?: string | null
          plan_bonus?: number | null
          politically_exposed?: boolean | null
          portfolio_history?: Json | null
          portfolio_holdings?: Json | null
          portfolio_value?: number | null
          postal_code?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          proof_of_address_verified?: boolean | null
          referral_code?: string | null
          referral_earnings?: number | null
          referred_by_code?: string | null
          registration_ip?: string | null
          risk_tolerance?: string | null
          role?: string | null
          security_alerts_enabled?: boolean | null
          selfie_verified?: boolean | null
          source_of_funds?: string | null
          staking_positions?: Json | null
          state?: string | null
          subscription_expires_at?: string | null
          subscription_plan_name?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          suspended_at?: string | null
          suspended_until?: string | null
          suspension_reason?: string | null
          tags?: string[] | null
          tax_code_pin?: string | null
          tax_country?: string | null
          tax_id_number?: string | null
          timezone?: string | null
          total_deposited?: number | null
          total_invested?: number | null
          total_rewards_earned?: number | null
          total_trading_volume?: number | null
          total_withdrawn?: number | null
          trades?: Json | null
          trading_experience?: string | null
          trading_notifications_enabled?: boolean | null
          transaction_history?: Json | null
          transactions?: Json | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string | null
          user_agent?: string | null
          username?: string | null
          verification_documents?: Json | null
          verification_level?: string | null
          verification_status?: string | null
          verified_at?: string | null
          wallet_addresses?: Json | null
          wallet_balance?: number | null
          withdrawal_pin?: string | null
          withdrawals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
