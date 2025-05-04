
import { createClient } from '@supabase/supabase-js';

// هذه هي بيانات الاتصال المؤقتة لسوبابيس
// يجب استبدالها ببياناتك الخاصة بعد إعداد سوبابيس
const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
