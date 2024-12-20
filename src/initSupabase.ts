import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
export const supabase = createClient(
  "https://ljncfqddlttfgctpnbgw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbmNmcWRkbHR0ZmdjdHBuYmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwODE0MDQsImV4cCI6MjA0OTY1NzQwNH0.2InoPqoI5n2v2PQbPZ3HyLbIU8bQQPZKEFuFJVDXN4s",
  {
    localStorage: AsyncStorage as any,
    detectSessionInUrl: false, // Prevents Supabase from evaluating window.location.href, breaking mobile
  }
);
