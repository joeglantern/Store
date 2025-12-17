// Quick script to check what tables exist in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnzvvmyrptwfgvsonfny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuenZ2bXlycHR3Zmd2c29uZm55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTc0MjA3NCwiZXhwIjoyMDgxMzE4MDc0fQ.q-tGxOCxVKvDRf1hQSLjFl_rTIzjZ05NsjtIn2_AJrk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking existing tables in Supabase...\n');

  // Query to get all tables in public schema
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `
  });

  if (error) {
    console.log('❌ Cannot use RPC. Trying direct table check...\n');

    // Try checking specific tables
    const tablesToCheck = [
      'profiles', 'categories', 'products', 'product_images',
      'variants', 'inventory', 'addresses', 'carts', 'cart_items',
      'orders', 'order_items', 'discounts', 'logs', 'admin_invitations'
    ];

    console.log('Checking expected tables:\n');

    for (const table of tablesToCheck) {
      const { data, error } = await supabase.from(table).select('*').limit(0);

      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ ${table} - Does NOT exist`);
        } else {
          console.log(`⚠️  ${table} - ${error.message}`);
        }
      } else {
        console.log(`✅ ${table} - EXISTS`);
      }
    }
  } else {
    console.log('Tables found:');
    console.log(data);
  }
}

checkTables();
