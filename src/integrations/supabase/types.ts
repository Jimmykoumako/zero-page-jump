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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audio_tracks: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          file_path: string
          file_size: number | null
          hymn_id: string | null
          id: string
          track_type: string
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          file_path: string
          file_size?: number | null
          hymn_id?: string | null
          id?: string
          track_type: string
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          file_path?: string
          file_size?: number | null
          hymn_id?: string | null
          id?: string
          track_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_tracks_hymn_id_fkey"
            columns: ["hymn_id"]
            isOneToOne: false
            referencedRelation: "hymns"
            referencedColumns: ["id"]
          },
        ]
      }
      hymn_modifications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          author: string | null
          composer: string | null
          created_at: string | null
          created_by: string
          id: string
          is_public: boolean | null
          key_signature: string | null
          lyrics_plain: string
          original_hymn_id: string
          reason_for_modification: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          author?: string | null
          composer?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          is_public?: boolean | null
          key_signature?: string | null
          lyrics_plain: string
          original_hymn_id: string
          reason_for_modification?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          author?: string | null
          composer?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          is_public?: boolean | null
          key_signature?: string | null
          lyrics_plain?: string
          original_hymn_id?: string
          reason_for_modification?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hymn_modifications_original_hymn_id_fkey"
            columns: ["original_hymn_id"]
            isOneToOne: false
            referencedRelation: "hymns"
            referencedColumns: ["id"]
          },
        ]
      }
      hymnbooks: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          publisher: string | null
          updated_at: string | null
          year_published: number | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          publisher?: string | null
          updated_at?: string | null
          year_published?: number | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          publisher?: string | null
          updated_at?: string | null
          year_published?: number | null
        }
        Relationships: []
      }
      hymnlist_items: {
        Row: {
          created_at: string | null
          hymn_id: string | null
          hymnlist_id: string | null
          id: string
          item_type: string | null
          position: number
          section_title: string | null
        }
        Insert: {
          created_at?: string | null
          hymn_id?: string | null
          hymnlist_id?: string | null
          id?: string
          item_type?: string | null
          position: number
          section_title?: string | null
        }
        Update: {
          created_at?: string | null
          hymn_id?: string | null
          hymnlist_id?: string | null
          id?: string
          item_type?: string | null
          position?: number
          section_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hymnlist_items_hymn_id_fkey"
            columns: ["hymn_id"]
            isOneToOne: false
            referencedRelation: "hymns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hymnlist_items_hymnlist_id_fkey"
            columns: ["hymnlist_id"]
            isOneToOne: false
            referencedRelation: "hymnlists"
            referencedColumns: ["id"]
          },
        ]
      }
      hymnlists: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string | null
          event_name: string | null
          id: string
          is_public: boolean | null
          locked_for_edit: boolean | null
          locked_for_view: boolean | null
          name: string
          song_leader: string | null
          unlock_code: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          event_name?: string | null
          id?: string
          is_public?: boolean | null
          locked_for_edit?: boolean | null
          locked_for_view?: boolean | null
          name: string
          song_leader?: string | null
          unlock_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          event_name?: string | null
          id?: string
          is_public?: boolean | null
          locked_for_edit?: boolean | null
          locked_for_view?: boolean | null
          name?: string
          song_leader?: string | null
          unlock_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hymns: {
        Row: {
          author: string | null
          composer: string | null
          copyright_info: string | null
          created_at: string | null
          hymnbook_id: string | null
          id: string
          key_signature: string | null
          lyrics_lrc: string
          lyrics_plain: string
          number: number | null
          status: string | null
          tempo: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          composer?: string | null
          copyright_info?: string | null
          created_at?: string | null
          hymnbook_id?: string | null
          id?: string
          key_signature?: string | null
          lyrics_lrc: string
          lyrics_plain: string
          number?: number | null
          status?: string | null
          tempo?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          composer?: string | null
          copyright_info?: string | null
          created_at?: string | null
          hymnbook_id?: string | null
          id?: string
          key_signature?: string | null
          lyrics_lrc?: string
          lyrics_plain?: string
          number?: number | null
          status?: string | null
          tempo?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hymns_hymnbook_id_fkey"
            columns: ["hymnbook_id"]
            isOneToOne: false
            referencedRelation: "hymnbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          preferred_key: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          preferred_key?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          preferred_key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          current_hymn_id: string | null
          current_position: number | null
          expires_at: string | null
          host_user_id: string | null
          hymnlist_id: string | null
          id: string
          is_active: boolean | null
          is_playing: boolean | null
          session_code: string
        }
        Insert: {
          created_at?: string | null
          current_hymn_id?: string | null
          current_position?: number | null
          expires_at?: string | null
          host_user_id?: string | null
          hymnlist_id?: string | null
          id?: string
          is_active?: boolean | null
          is_playing?: boolean | null
          session_code: string
        }
        Update: {
          created_at?: string | null
          current_hymn_id?: string | null
          current_position?: number | null
          expires_at?: string | null
          host_user_id?: string | null
          hymnlist_id?: string | null
          id?: string
          is_active?: boolean | null
          is_playing?: boolean | null
          session_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_current_hymn_id_fkey"
            columns: ["current_hymn_id"]
            isOneToOne: false
            referencedRelation: "hymns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_hymnlist_id_fkey"
            columns: ["hymnlist_id"]
            isOneToOne: false
            referencedRelation: "hymnlists"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_projects: {
        Row: {
          created_at: string | null
          hymn_id: string | null
          id: string
          name: string
          sync_data: Json | null
          title: string
          track_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          hymn_id?: string | null
          id?: string
          name: string
          sync_data?: Json | null
          title: string
          track_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          hymn_id?: string | null
          id?: string
          name?: string
          sync_data?: Json | null
          title?: string
          track_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_projects_hymn_id_fkey"
            columns: ["hymn_id"]
            isOneToOne: false
            referencedRelation: "hymns"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          password_hash: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email: string
          id?: string
          password_hash: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          password_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_by_email: {
        Args: { user_email: string }
        Returns: {
          display_name: string
          email: string
          id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "uploader"
        | "proofreader"
        | "curator"
        | "reviewer"
        | "contributor"
        | "viewer"
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
    Enums: {
      app_role: [
        "admin",
        "uploader",
        "proofreader",
        "curator",
        "reviewer",
        "contributor",
        "viewer",
      ],
    },
  },
} as const
