// my_clean_website/js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Cliente Supabase conectado directamente a tu base de datos de PostgreSQL/Supabase
const SUPABASE_URL = 'https://rroxtrlogzqqvdhcjtfn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyb3h0cmxvZ3pxcXZkaGNqdGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTA0MDAwMH0.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
