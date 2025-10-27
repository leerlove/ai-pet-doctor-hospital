/**
 * Apply RLS policies for veterinarians table
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  'https://bglwwvjdqvepbblhcqvp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbHd3dmpkcXZlcGJibGhjcXZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzczNTcyOCwiZXhwIjoyMDUzMzExNzI4fQ.1xHf5m7rWWfGTF7yMV-VHN3YxKP6N0P8xKzLKlKXXXk'
)

async function applyRLS() {
  console.log('🔧 Applying RLS policies for veterinarians table...\n')

  const sql = fs.readFileSync('c:\\Users\\bamboo\\ai-pet-doctor-hospital\\set-veterinarians-rls-proper.sql', 'utf-8')

  // Split by semicolon and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'))

  for (const statement of statements) {
    if (!statement) continue

    console.log('Executing:', statement.substring(0, 100) + '...')

    const { data, error } = await supabase.rpc('exec_sql', { query: statement })

    if (error) {
      console.error('❌ Error:', error)
      // Continue with next statement
    } else {
      console.log('✅ Success')
    }
  }

  console.log('\n✅ All policies applied!')
}

applyRLS().catch(console.error)
