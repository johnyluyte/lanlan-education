import { createClient } from '@supabase/supabase-js'

// SPA (ssr: false) — single browser-side client, provided app-wide as $supabase.
export default defineNuxtPlugin(() => {
  const { supabaseUrl, supabasePublishableKey } = useRuntimeConfig().public

  // 未設定時提早 return：避免 createClient('' , '') 直接 throw 'supabaseUrl is required.' 炸掉 app 初始化。
  if (!supabaseUrl || !supabasePublishableKey) {
    console.warn('[supabase] Missing NUXT_PUBLIC_SUPABASE_URL or NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — client not configured')
    return
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return {
    provide: {
      supabase,
    },
  }
})
