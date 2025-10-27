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
      booking_responses: {
        Row: {
          alternative_clinics: Json | null
          booking_id: string
          created_at: string | null
          created_by: string | null
          hospital_message: string | null
          id: string
          modification_reason: string | null
          rejection_reason: string | null
          response_type: string
          suggested_dates: Json | null
          webhook_response: string | null
          webhook_sent: boolean | null
          webhook_sent_at: string | null
        }
        Insert: {
          alternative_clinics?: Json | null
          booking_id: string
          created_at?: string | null
          created_by?: string | null
          hospital_message?: string | null
          id?: string
          modification_reason?: string | null
          rejection_reason?: string | null
          response_type: string
          suggested_dates?: Json | null
          webhook_response?: string | null
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
        }
        Update: {
          alternative_clinics?: Json | null
          booking_id?: string
          created_at?: string | null
          created_by?: string | null
          hospital_message?: string | null
          id?: string
          modification_reason?: string | null
          rejection_reason?: string | null
          response_type?: string
          suggested_dates?: Json | null
          webhook_response?: string | null
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_responses_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_responses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          admin_notes: string | null
          ai_pet_doctor_pet_id: string | null
          ai_pet_doctor_request_id: string | null
          ai_pet_doctor_user_id: string | null
          booking_date: string
          booking_number: string
          booking_time: string
          clinic_id: string
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          pet_age: number | null
          pet_breed: string | null
          pet_id: string | null
          pet_name: string
          pet_species: string
          service_id: string | null
          source: string
          status: string
          symptoms: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          ai_pet_doctor_pet_id?: string | null
          ai_pet_doctor_request_id?: string | null
          ai_pet_doctor_user_id?: string | null
          booking_date: string
          booking_number?: string
          booking_time: string
          clinic_id: string
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          pet_age?: number | null
          pet_breed?: string | null
          pet_id?: string | null
          pet_name: string
          pet_species: string
          service_id?: string | null
          source?: string
          status?: string
          symptoms?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          ai_pet_doctor_pet_id?: string | null
          ai_pet_doctor_request_id?: string | null
          ai_pet_doctor_user_id?: string | null
          booking_date?: string
          booking_number?: string
          booking_time?: string
          clinic_id?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          pet_age?: number | null
          pet_breed?: string | null
          pet_id?: string | null
          pet_name?: string
          pet_species?: string
          service_id?: string | null
          source?: string
          status?: string
          symptoms?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          clinic_id: string
          close_time: string | null
          created_at: string | null
          day_of_week: number
          id: string
          is_open: boolean | null
          open_time: string | null
          updated_at: string | null
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          clinic_id: string
          close_time?: string | null
          created_at?: string | null
          day_of_week: number
          id?: string
          is_open?: boolean | null
          open_time?: string | null
          updated_at?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          clinic_id?: string
          close_time?: string | null
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_open?: boolean | null
          open_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          phone_1: string | null
          phone_2: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          phone_1?: string | null
          phone_2?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          phone_1?: string | null
          phone_2?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      closed_dates: {
        Row: {
          clinic_id: string
          created_at: string | null
          date: string
          id: string
          reason: string | null
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          date: string
          id?: string
          reason?: string | null
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          date?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "closed_dates_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number | null
          breed: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string | null
          species: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          breed?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id?: string | null
          species: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          breed?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string | null
          species?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_diagnoses: {
        Row: {
          additional_notes: string | null
          ai_recommendations: string | null
          allergies: Json | null
          booking_id: string
          chronic_conditions: Json | null
          confidence: number | null
          created_at: string | null
          current_medications: Json | null
          diagnosis_created_at: string | null
          diagnosis_id: string
          duration: string | null
          hospital_visit_required: boolean | null
          id: string
          past_visits: Json | null
          recommended_tests: Json | null
          severity: number | null
          special_notes: string | null
          suspected_conditions: Json | null
          symptoms: Json | null
          updated_at: string | null
          urgency: string
          vaccinations: Json | null
        }
        Insert: {
          additional_notes?: string | null
          ai_recommendations?: string | null
          allergies?: Json | null
          booking_id: string
          chronic_conditions?: Json | null
          confidence?: number | null
          created_at?: string | null
          current_medications?: Json | null
          diagnosis_created_at?: string | null
          diagnosis_id: string
          duration?: string | null
          hospital_visit_required?: boolean | null
          id?: string
          past_visits?: Json | null
          recommended_tests?: Json | null
          severity?: number | null
          special_notes?: string | null
          suspected_conditions?: Json | null
          symptoms?: Json | null
          updated_at?: string | null
          urgency?: string
          vaccinations?: Json | null
        }
        Update: {
          additional_notes?: string | null
          ai_recommendations?: string | null
          allergies?: Json | null
          booking_id?: string
          chronic_conditions?: Json | null
          confidence?: number | null
          created_at?: string | null
          current_medications?: Json | null
          diagnosis_created_at?: string | null
          diagnosis_id?: string
          duration?: string | null
          hospital_visit_required?: boolean | null
          id?: string
          past_visits?: Json | null
          recommended_tests?: Json | null
          severity?: number | null
          special_notes?: string | null
          suspected_conditions?: Json | null
          symptoms?: Json | null
          updated_at?: string | null
          urgency?: string
          vaccinations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_diagnoses_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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

// Type aliases for backward compatibility
export type User = Tables<'users'>
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>

export type Booking = Tables<'bookings'>
export type BookingInsert = TablesInsert<'bookings'>
export type BookingUpdate = TablesUpdate<'bookings'>

export type Clinic = Tables<'clinics'>
export type ClinicInsert = TablesInsert<'clinics'>
export type ClinicUpdate = TablesUpdate<'clinics'>

export type Service = Tables<'services'>
export type ServiceInsert = TablesInsert<'services'>
export type ServiceUpdate = TablesUpdate<'services'>

export type Pet = Tables<'pets'>
export type PetInsert = TablesInsert<'pets'>
export type PetUpdate = TablesUpdate<'pets'>

export type Notification = Tables<'notifications'>
export type NotificationInsert = TablesInsert<'notifications'>
export type NotificationUpdate = TablesUpdate<'notifications'>

export type SmartDiagnosis = Tables<'smart_diagnoses'>
export type SmartDiagnosisInsert = TablesInsert<'smart_diagnoses'>
export type SmartDiagnosisUpdate = TablesUpdate<'smart_diagnoses'>

export type BookingResponse = Tables<'booking_responses'>
export type BookingResponseInsert = TablesInsert<'booking_responses'>
export type BookingResponseUpdate = TablesUpdate<'booking_responses'>

export type BusinessHour = Tables<'business_hours'>
export type BusinessHourInsert = TablesInsert<'business_hours'>
export type BusinessHourUpdate = TablesUpdate<'business_hours'>

export type ClosedDate = Tables<'closed_dates'>
export type ClosedDateInsert = TablesInsert<'closed_dates'>
export type ClosedDateUpdate = TablesUpdate<'closed_dates'>
