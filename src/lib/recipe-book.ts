import { supabase } from './supabase'
import { Flow } from '@/types/flow'

export async function getSavedRecipes(userEmail: string): Promise<Flow[]> {
  const { data, error } = await supabase
    .from('saved_recipes')
    .select('flow')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data.map((r) => r.flow as Flow)
}

export async function saveRecipe(userEmail: string, flow: Flow): Promise<void> {
  await supabase.from('saved_recipes').upsert(
    { user_email: userEmail, flow_id: flow.id, flow },
    { onConflict: 'user_email,flow_id' }
  )
}

export async function isRecipeSaved(userEmail: string, flowId: string): Promise<boolean> {
  const { data } = await supabase
    .from('saved_recipes')
    .select('id')
    .eq('user_email', userEmail)
    .eq('flow_id', flowId)
    .maybeSingle()
  return !!data
}

export async function removeRecipe(userEmail: string, flowId: string): Promise<void> {
  await supabase
    .from('saved_recipes')
    .delete()
    .eq('user_email', userEmail)
    .eq('flow_id', flowId)
}
