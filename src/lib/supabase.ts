import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ufukmcpltflgmpludteh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdWttY3BsdGZsZ21wbHVkdGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDExMjAsImV4cCI6MjA5NDQxNzEyMH0.j0_0R17eLD5eRRhS5kDVWve3cc-U5gOM5D3lciwAWeo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
