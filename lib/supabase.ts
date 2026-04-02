import { createBrowserClient } from '@supabase/ssr'

export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  const supabase = createSupabaseClient()
  return supabase.auth.signOut()
}

export async function saveDiagnosis(
  userId: string,
  symptoms: string,
  diagnosis: any,
  imageUrl?: string
) {
  const supabase = createSupabaseClient()
  return supabase.from('diagnoses').insert({
    user_id: userId,
    symptoms,
    diagnosis_data: diagnosis,
    image_url: imageUrl,
    created_at: new Date().toISOString(),
  })
}

export async function getDiagnoses(userId: string) {
  const supabase = createSupabaseClient()
  return supabase
    .from('diagnoses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function deleteDiagnosis(id: string) {
  const supabase = createSupabaseClient()
  return supabase.from('diagnoses').delete().eq('id', id)
}

export async function createShareableLink(
  diagnosisId: string,
  access: 'public' | 'doctor' = 'public',
  expiresInDays = 30
) {
  const supabase = createSupabaseClient()
  const shareToken = Math.random().toString(36).substring(2, 15) + Date.now()
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    .toISOString()

  return supabase.from('shared_reports').insert({
    diagnosis_id: diagnosisId,
    share_token: shareToken,
    access,
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  })
}

export function isUserDoctor(user: any) {
  return (
    user?.app_metadata?.role === 'doctor' ||
    user?.user_metadata?.role === 'doctor' ||
    user?.email?.endsWith('@medai.health') // fallback special domain
  )
}

export async function getSharedReport(shareToken: string) {
  const supabase = createSupabaseClient()
  const { data: shareData } = await supabase
    .from('shared_reports')
    .select('*, diagnoses(*)')
    .eq('share_token', shareToken)
    .single()

  if (!shareData) return { error: 'Link not found' }

  const now = new Date()
  if (shareData.expires_at && new Date(shareData.expires_at) < now) {
    return { error: 'Link has expired' }
  }

  // If the report is flagged Doctor-only, ensure doctor role
  if (shareData.access === 'doctor') {
    const { data: sessionData } = await supabase.auth.getUser()
    const sessionUser = sessionData?.user

    if (!isUserDoctor(sessionUser)) {
      return { error: 'You must be a doctor to view this report' }
    }
  }

  if (!shareData.diagnoses) {
    return { error: 'Diagnosis data not found' }
  }

  return {
    diagnosis: shareData.diagnoses,
    access: shareData.access,
    expires_at: shareData.expires_at,
  }
}
