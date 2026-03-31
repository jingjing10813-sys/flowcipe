import { Flow } from '@/types/flow'

const STORAGE_KEY = 'flowcipe_recipe_book'

export function getSavedRecipes(): Flow[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRecipe(flow: Flow): void {
  const recipes = getSavedRecipes()
  const exists = recipes.some((r) => r.id === flow.id)
  if (exists) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify([flow, ...recipes]))
}

export function isRecipeSaved(flowId: string): boolean {
  return getSavedRecipes().some((r) => r.id === flowId)
}

export function removeRecipe(flowId: string): void {
  const recipes = getSavedRecipes().filter((r) => r.id !== flowId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}
