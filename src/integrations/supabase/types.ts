export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login: string | null
          password_hash: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string
          role?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          excerpt: string
          id: string
          image_url: string | null
          read_time: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          excerpt: string
          id?: string
          image_url?: string | null
          read_time?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string
          id?: string
          image_url?: string | null
          read_time?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          phone: string | null
          service_needed: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          phone?: string | null
          service_needed?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          phone?: string | null
          service_needed?: string | null
          status?: string | null
        }
        Relationships: []
      }
      daily_quotes: {
        Row: {
          author: string | null
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          quote_text: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          quote_text: string
        }
        Update: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          quote_text?: string
        }
        Relationships: []
      }
      repair_requests: {
        Row: {
          brand: string | null
          created_at: string | null
          device_type: string
          estimated_cost: string | null
          id: string
          issue_description: string
          model: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
          urgency_level: string | null
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          device_type: string
          estimated_cost?: string | null
          id?: string
          issue_description: string
          model?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          device_type?: string
          estimated_cost?: string | null
          id?: string
          issue_description?: string
          model?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string
          features: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number | null
          price: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          price: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          price?: string
          title?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string
          created_at: string | null
          github_url: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          order_index: number | null
          position: string
          specialties: string[] | null
          twitter_url: string | null
        }
        Insert: {
          bio: string
          created_at?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          order_index?: number | null
          position: string
          specialties?: string[] | null
          twitter_url?: string | null
        }
        Update: {
          bio?: string
          created_at?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          order_index?: number | null
          position?: string
          specialties?: string[] | null
          twitter_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      analytics_overview: {
        Row: {
          active_services: number | null
          active_team_members: number | null
          new_messages: number | null
          today_messages: number | null
          total_blog_posts: number | null
          total_messages: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_analytics_overview: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_messages: number
          new_messages: number
          today_messages: number
          total_blog_posts: number
          active_services: number
          active_team_members: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
