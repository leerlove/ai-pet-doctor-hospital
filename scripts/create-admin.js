/**
 * 관리자 계정 생성 스크립트
 * Usage: node scripts/create-admin.js
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminUser() {
  console.log('🚀 Creating admin account...\n')

  const adminEmail = 'admin@aipetdoctor.com'
  const adminPassword = 'Admin1234!@'

  try {
    // 1. Sign up admin user
    console.log('📝 Step 1: Creating Supabase Auth user...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: '관리자',
          role: 'admin',
        },
      },
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  User already exists, trying to sign in...')

        // Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        })

        if (signInError) {
          throw new Error(`Failed to sign in: ${signInError.message}`)
        }

        console.log('✅ Signed in successfully')

        // Update user role in database
        const userId = signInData.user.id
        await updateUserRole(userId)

        console.log('\n✅ Admin account is ready!')
        console.log('\n📋 Login credentials:')
        console.log(`   Email: ${adminEmail}`)
        console.log(`   Password: ${adminPassword}`)
        console.log('\n🔗 Login at: http://localhost:5174/login\n')

        process.exit(0)
      }
      throw authError
    }

    console.log('✅ Supabase Auth user created')

    if (!authData.user) {
      throw new Error('No user data returned')
    }

    const userId = authData.user.id

    // 2. Update user role in database
    await updateUserRole(userId)

    console.log('\n✅ Admin account created successfully!')
    console.log('\n📋 Login credentials:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n🔗 Login at: http://localhost:5174/login\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error creating admin account:', error.message)
    process.exit(1)
  }
}

async function updateUserRole(userId) {
  console.log('\n📝 Step 2: Updating user role to admin...')

  // Check if user exists in users table
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', userId)
    .single()

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(`Failed to check user: ${checkError.message}`)
  }

  if (existingUser) {
    // Update existing user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        role: 'admin',
        full_name: '관리자',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      throw new Error(`Failed to update user role: ${updateError.message}`)
    }

    console.log('✅ User role updated to admin')
  } else {
    // Insert new user record
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: 'admin@aipetdoctor.com',
        role: 'admin',
        full_name: '관리자',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (insertError) {
      throw new Error(`Failed to insert user: ${insertError.message}`)
    }

    console.log('✅ User record created with admin role')
  }
}

// Run the script
createAdminUser()
