import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createSupabaseClient = () => {
  return createClientComponentClient()
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createSupabaseClient()
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseClient()
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
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

export async function createShareableLink(diagnosisId: string) {
  const supabase = createSupabaseClient()
  const shareToken = Math.random().toString(36).substring(2, 15) + Date.now()
  return supabase.from('shared_reports').insert({
    diagnosis_id: diagnosisId,
    share_token: shareToken,
    created_at: new Date().toISOString(),
  })
}

export async function getSharedReport(shareToken: string) {
  const supabase = createSupabaseClient()
  const { data: shareData } = await supabase
    .from('shared_reports')
    .select('diagnosis_id')
    .eq('share_token', shareToken)
    .single()

  if (!shareData) return null

  const { data: diagnosis } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('id', shareData.diagnosis_id)
    .single()

  return diagnosis
}
