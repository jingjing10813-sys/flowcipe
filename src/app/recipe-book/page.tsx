import { AppLayout } from '@/components/layout/AppLayout'
import { PageShell } from '@/components/layout/PageShell'
import { RecipeBookClient } from '@/components/recipe-book/RecipeBookClient'

export default function RecipeBookPage() {
  return (
    <AppLayout>
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-white/[0.08]">
        <PageShell wide>
          <div className="py-2">
            <h1 className="text-[24px] font-bold text-gray-900 dark:text-[#f5f5f5] tracking-tight">내 레시피</h1>
            <p className="text-[13.5px] text-gray-400 dark:text-[#737373] mt-1">완주한 Flow가 레시피로 저장됩니다</p>
          </div>
        </PageShell>
      </div>
      <PageShell wide>
        <RecipeBookClient />
      </PageShell>
    </AppLayout>
  )
}
