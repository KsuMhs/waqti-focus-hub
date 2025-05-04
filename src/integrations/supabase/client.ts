
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zwpfyvvqxcdxvicntayr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cGZ5dnZxeGNkeHZpY250YXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTQxODEsImV4cCI6MjA2MTkzMDE4MX0.oFgr_X2bAe0X3vsJde3lJpDTVaKkmd_yNLVpFo9qFDU";

// استيراد عميل Supabase بهذه الطريقة:
// import { supabase } from "@/integrations/supabase/client";

// إنشاء نسخة واحدة من عميل Supabase للاستخدام في جميع أنحاء التطبيق
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined, // التحقق من وجود window
    detectSessionInUrl: true,
    flowType: 'pkce' // استخدام PKCE بدلاً من implicit لتحسين الأمان
  }
});

// إضافة دالة مساعدة للتحقق من الاتصال بـ Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // تنفيذ استعلام بسيط للتحقق من صحة الاتصال
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error("خطأ في الاتصال بـ Supabase:", error);
    return false;
  }
};
