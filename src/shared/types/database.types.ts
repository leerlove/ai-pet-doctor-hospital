/**
 * Database Types - AI펫닥터 병원 예약 관리 시스템
 *
 * 이 파일은 Supabase CLI로 자동 생성할 수 있습니다:
 * pnpm supabase:types
 *
 * 현재는 수동으로 작성된 타입입니다.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'customer' | 'admin'
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'customer' | 'admin'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'customer' | 'admin'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clinics: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          phone_1: string | null
          phone_2: string | null
          email: string | null
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          phone_1?: string | null
          phone_2?: string | null
          email?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          phone_1?: string | null
          phone_2?: string | null
          email?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          clinic_id: string | null
          name: string
          description: string | null
          duration_minutes: number
          price: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id?: string | null
          name: string
          description?: string | null
          duration_minutes?: number
          price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string | null
          name?: string
          description?: string | null
          duration_minutes?: number
          price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          species: 'dog' | 'cat' | 'other'
          breed: string | null
          age: number | null
          weight: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name: string
          species: 'dog' | 'cat' | 'other'
          breed?: string | null
          age?: number | null
          weight?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          species?: 'dog' | 'cat' | 'other'
          breed?: string | null
          age?: number | null
          weight?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          booking_number: string
          clinic_id: string
          service_id: string | null
          user_id: string | null
          pet_id: string | null
          booking_date: string
          booking_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
          customer_name: string
          customer_phone: string
          customer_email: string | null
          pet_name: string
          pet_species: string
          pet_breed: string | null
          pet_age: number | null
          symptoms: string | null
          admin_notes: string | null
          source: 'direct' | 'ai_pet_doctor'
          ai_pet_doctor_request_id: string | null
          ai_pet_doctor_user_id: string | null
          ai_pet_doctor_pet_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_number?: string
          clinic_id: string
          service_id?: string | null
          user_id?: string | null
          pet_id?: string | null
          booking_date: string
          booking_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          pet_name: string
          pet_species: string
          pet_breed?: string | null
          pet_age?: number | null
          symptoms?: string | null
          admin_notes?: string | null
          source?: 'direct' | 'ai_pet_doctor'
          ai_pet_doctor_request_id?: string | null
          ai_pet_doctor_user_id?: string | null
          ai_pet_doctor_pet_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_number?: string
          clinic_id?: string
          service_id?: string | null
          user_id?: string | null
          pet_id?: string | null
          booking_date?: string
          booking_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          pet_name?: string
          pet_species?: string
          pet_breed?: string | null
          pet_age?: number | null
          symptoms?: string | null
          admin_notes?: string | null
          source?: 'direct' | 'ai_pet_doctor'
          ai_pet_doctor_request_id?: string | null
          ai_pet_doctor_user_id?: string | null
          ai_pet_doctor_pet_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      smart_diagnoses: {
        Row: {
          id: string
          diagnosis_id: string
          booking_id: string
          urgency: 'low' | 'medium' | 'high' | 'emergency'
          symptoms: Json | null
          duration: string | null
          severity: number | null
          additional_notes: string | null
          suspected_conditions: Json | null
          confidence: number | null
          hospital_visit_required: boolean
          recommended_tests: Json | null
          ai_recommendations: string | null
          past_visits: Json | null
          allergies: Json | null
          current_medications: Json | null
          vaccinations: Json | null
          chronic_conditions: Json | null
          special_notes: string | null
          diagnosis_created_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          diagnosis_id: string
          booking_id: string
          urgency?: 'low' | 'medium' | 'high' | 'emergency'
          symptoms?: Json | null
          duration?: string | null
          severity?: number | null
          additional_notes?: string | null
          suspected_conditions?: Json | null
          confidence?: number | null
          hospital_visit_required?: boolean
          recommended_tests?: Json | null
          ai_recommendations?: string | null
          past_visits?: Json | null
          allergies?: Json | null
          current_medications?: Json | null
          vaccinations?: Json | null
          chronic_conditions?: Json | null
          special_notes?: string | null
          diagnosis_created_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          diagnosis_id?: string
          booking_id?: string
          urgency?: 'low' | 'medium' | 'high' | 'emergency'
          symptoms?: Json | null
          duration?: string | null
          severity?: number | null
          additional_notes?: string | null
          suspected_conditions?: Json | null
          confidence?: number | null
          hospital_visit_required?: boolean
          recommended_tests?: Json | null
          ai_recommendations?: string | null
          past_visits?: Json | null
          allergies?: Json | null
          current_medications?: Json | null
          vaccinations?: Json | null
          chronic_conditions?: Json | null
          special_notes?: string | null
          diagnosis_created_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      booking_responses: {
        Row: {
          id: string
          booking_id: string
          response_type: 'confirmed' | 'modified' | 'rejected'
          suggested_dates: Json | null
          modification_reason: string | null
          rejection_reason: string | null
          alternative_clinics: Json | null
          hospital_message: string | null
          webhook_sent: boolean
          webhook_sent_at: string | null
          webhook_response: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          booking_id: string
          response_type: 'confirmed' | 'modified' | 'rejected'
          suggested_dates?: Json | null
          modification_reason?: string | null
          rejection_reason?: string | null
          alternative_clinics?: Json | null
          hospital_message?: string | null
          webhook_sent?: boolean
          webhook_sent_at?: string | null
          webhook_response?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          booking_id?: string
          response_type?: 'confirmed' | 'modified' | 'rejected'
          suggested_dates?: Json | null
          modification_reason?: string | null
          rejection_reason?: string | null
          alternative_clinics?: Json | null
          hospital_message?: string | null
          webhook_sent?: boolean
          webhook_sent_at?: string | null
          webhook_response?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      business_hours: {
        Row: {
          id: string
          clinic_id: string
          day_of_week: number
          is_open: boolean
          open_time: string | null
          close_time: string | null
          break_start: string | null
          break_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          day_of_week: number
          is_open?: boolean
          open_time?: string | null
          close_time?: string | null
          break_start?: string | null
          break_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          day_of_week?: number
          is_open?: boolean
          open_time?: string | null
          close_time?: string | null
          break_start?: string | null
          break_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      closed_dates: {
        Row: {
          id: string
          clinic_id: string
          date: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          date: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          date?: string
          reason?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          booking_id: string | null
          type: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_id?: string | null
          type: string
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_id?: string | null
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
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
  }
}

// 편의성을 위한 타입 별칭
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Clinic = Database['public']['Tables']['clinics']['Row']
export type ClinicInsert = Database['public']['Tables']['clinics']['Insert']
export type ClinicUpdate = Database['public']['Tables']['clinics']['Update']

export type Service = Database['public']['Tables']['services']['Row']
export type ServiceInsert = Database['public']['Tables']['services']['Insert']
export type ServiceUpdate = Database['public']['Tables']['services']['Update']

export type Pet = Database['public']['Tables']['pets']['Row']
export type PetInsert = Database['public']['Tables']['pets']['Insert']
export type PetUpdate = Database['public']['Tables']['pets']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export type SmartDiagnosis = Database['public']['Tables']['smart_diagnoses']['Row']
export type SmartDiagnosisInsert = Database['public']['Tables']['smart_diagnoses']['Insert']
export type SmartDiagnosisUpdate = Database['public']['Tables']['smart_diagnoses']['Update']

export type BookingResponse = Database['public']['Tables']['booking_responses']['Row']
export type BookingResponseInsert = Database['public']['Tables']['booking_responses']['Insert']
export type BookingResponseUpdate = Database['public']['Tables']['booking_responses']['Update']

export type BusinessHour = Database['public']['Tables']['business_hours']['Row']
export type BusinessHourInsert = Database['public']['Tables']['business_hours']['Insert']
export type BusinessHourUpdate = Database['public']['Tables']['business_hours']['Update']

export type ClosedDate = Database['public']['Tables']['closed_dates']['Row']
export type ClosedDateInsert = Database['public']['Tables']['closed_dates']['Insert']
export type ClosedDateUpdate = Database['public']['Tables']['closed_dates']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']
