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
      crop_advisory: {
        Row: {
          advisory_text: string
          advisory_text_hindi: string | null
          created_at: string
          crop_name: string
          id: string
          region: string | null
          season: string
          updated_at: string
        }
        Insert: {
          advisory_text: string
          advisory_text_hindi?: string | null
          created_at?: string
          crop_name: string
          id?: string
          region?: string | null
          season: string
          updated_at?: string
        }
        Update: {
          advisory_text?: string
          advisory_text_hindi?: string | null
          created_at?: string
          crop_name?: string
          id?: string
          region?: string | null
          season?: string
          updated_at?: string
        }
        Relationships: []
      }
      farmer_profiles: {
        Row: {
          created_at: string
          id: string
          irrigation_type: string | null
          land_size: string | null
          location: string | null
          name: string
          phone: string | null
          preferred_language: string | null
          soil_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          irrigation_type?: string | null
          land_size?: string | null
          location?: string | null
          name: string
          phone?: string | null
          preferred_language?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          irrigation_type?: string | null
          land_size?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          preferred_language?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      government_schemes: {
        Row: {
          application_link: string | null
          created_at: string
          description: string
          description_hindi: string | null
          eligibility: string | null
          id: string
          is_active: boolean | null
          scheme_name: string
          scheme_name_hindi: string | null
          subsidy_amount: number | null
        }
        Insert: {
          application_link?: string | null
          created_at?: string
          description: string
          description_hindi?: string | null
          eligibility?: string | null
          id?: string
          is_active?: boolean | null
          scheme_name: string
          scheme_name_hindi?: string | null
          subsidy_amount?: number | null
        }
        Update: {
          application_link?: string | null
          created_at?: string
          description?: string
          description_hindi?: string | null
          eligibility?: string | null
          id?: string
          is_active?: boolean | null
          scheme_name?: string
          scheme_name_hindi?: string | null
          subsidy_amount?: number | null
        }
        Relationships: []
      }
      mandi_rates: {
        Row: {
          created_at: string
          crop_name: string
          date: string
          id: string
          market_name: string
          price_per_quintal: number
        }
        Insert: {
          created_at?: string
          crop_name: string
          date?: string
          id?: string
          market_name: string
          price_per_quintal: number
        }
        Update: {
          created_at?: string
          crop_name?: string
          date?: string
          id?: string
          market_name?: string
          price_per_quintal?: number
        }
        Relationships: []
      }
      plant_disease_detections: {
        Row: {
          confidence_score: number | null
          created_at: string
          disease_detected: string | null
          farmer_id: string | null
          id: string
          image_url: string | null
          treatment_advice: string | null
          treatment_advice_hindi: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          disease_detected?: string | null
          farmer_id?: string | null
          id?: string
          image_url?: string | null
          treatment_advice?: string | null
          treatment_advice_hindi?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          disease_detected?: string | null
          farmer_id?: string | null
          id?: string
          image_url?: string | null
          treatment_advice?: string | null
          treatment_advice_hindi?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plant_disease_detections_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          created_at: string
          forecast_date: string
          humidity: number | null
          id: string
          location: string
          temperature_max: number | null
          temperature_min: number | null
          updated_at: string
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          created_at?: string
          forecast_date: string
          humidity?: number | null
          id?: string
          location: string
          temperature_max?: number | null
          temperature_min?: number | null
          updated_at?: string
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          created_at?: string
          forecast_date?: string
          humidity?: number | null
          id?: string
          location?: string
          temperature_max?: number | null
          temperature_min?: number | null
          updated_at?: string
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Relationships: []
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
