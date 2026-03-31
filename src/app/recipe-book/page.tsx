import { AppLayout } from '@/components/layout/AppLayout'
import { PageShell } from '@/components/layout/PageShell'
import { RecipeBookClient } from '@/components/recipe-book/RecipeBookClient'

export default function RecipeBookPage() {
  return (
    <AppLayout>
      <PageShell>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">나의 레시피북</h1>
          <p className="text-sm text-gray-400 mt-1">완주한 Flow가 여기 저장됩니다</p>
        </div>
        <RecipeBookClient />
      </PageShell>
    </AppLayout>
  )
}
