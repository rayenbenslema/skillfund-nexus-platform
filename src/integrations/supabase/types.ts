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
      campaigns: {
        Row: {
          backers_count: number | null
          category: string
          created_at: string | null
          creator_id: string
          current_amount: number | null
          deadline: string
          description: string
          goal_amount: number
          id: string
          image_url: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          story: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          backers_count?: number | null
          category: string
          created_at?: string | null
          creator_id: string
          current_amount?: number | null
          deadline: string
          description: string
          goal_amount: number
          id?: string
          image_url?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          story?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          backers_count?: number | null
          category?: string
          created_at?: string | null
          creator_id?: string
          current_amount?: number | null
          deadline?: string
          description?: string
          goal_amount?: number
          id?: string
          image_url?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          story?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          amount: number
          backer_id: string
          campaign_id: string
          created_at: string | null
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          reward_tier_id: string | null
        }
        Insert: {
          amount: number
          backer_id: string
          campaign_id: string
          created_at?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          reward_tier_id?: string | null
        }
        Update: {
          amount?: number
          backer_id?: string
          campaign_id?: string
          created_at?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          reward_tier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_backer_id_fkey"
            columns: ["backer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_reward_tier_id_fkey"
            columns: ["reward_tier_id"]
            isOneToOne: false
            referencedRelation: "reward_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category: string
          client_id: string
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          proposals_count: number | null
          skills_required: string[] | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category: string
          client_id: string
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          proposals_count?: number | null
          skills_required?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          client_id?: string
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          proposals_count?: number | null
          skills_required?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          hourly_rate: number | null
          id: string
          interests: string[] | null
          is_verified: boolean | null
          location: string | null
          primary_role: Database["public"]["Enums"]["user_role"]
          rating: number | null
          reviews_count: number | null
          skills: string[] | null
          total_earned: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          interests?: string[] | null
          is_verified?: boolean | null
          location?: string | null
          primary_role: Database["public"]["Enums"]["user_role"]
          rating?: number | null
          reviews_count?: number | null
          skills?: string[] | null
          total_earned?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          interests?: string[] | null
          is_verified?: boolean | null
          location?: string | null
          primary_role?: Database["public"]["Enums"]["user_role"]
          rating?: number | null
          reviews_count?: number | null
          skills?: string[] | null
          total_earned?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          cover_letter: string
          created_at: string | null
          estimated_duration: string | null
          freelancer_id: string
          id: string
          job_id: string
          proposed_rate: number
          status: Database["public"]["Enums"]["proposal_status"] | null
        }
        Insert: {
          cover_letter: string
          created_at?: string | null
          estimated_duration?: string | null
          freelancer_id: string
          id?: string
          job_id: string
          proposed_rate: number
          status?: Database["public"]["Enums"]["proposal_status"] | null
        }
        Update: {
          cover_letter?: string
          created_at?: string | null
          estimated_duration?: string | null
          freelancer_id?: string
          id?: string
          job_id?: string
          proposed_rate?: number
          status?: Database["public"]["Enums"]["proposal_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_tiers: {
        Row: {
          amount: number
          backers_count: number | null
          campaign_id: string
          created_at: string | null
          description: string
          estimated_delivery: string | null
          id: string
          max_backers: number | null
          title: string
        }
        Insert: {
          amount: number
          backers_count?: number | null
          campaign_id: string
          created_at?: string | null
          description: string
          estimated_delivery?: string | null
          id?: string
          max_backers?: number | null
          title: string
        }
        Update: {
          amount?: number
          backers_count?: number | null
          campaign_id?: string
          created_at?: string | null
          description?: string
          estimated_delivery?: string | null
          id?: string
          max_backers?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_tiers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
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
      campaign_status: "draft" | "active" | "funded" | "cancelled" | "completed"
      job_status: "open" | "in_progress" | "completed" | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      proposal_status: "pending" | "accepted" | "rejected"
      user_role: "freelancer" | "client" | "project_owner" | "backer"
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
    Enums: {
      campaign_status: ["draft", "active", "funded", "cancelled", "completed"],
      job_status: ["open", "in_progress", "completed", "cancelled"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      proposal_status: ["pending", "accepted", "rejected"],
      user_role: ["freelancer", "client", "project_owner", "backer"],
    },
  },
} as const
