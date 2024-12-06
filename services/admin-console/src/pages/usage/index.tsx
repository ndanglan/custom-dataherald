import PageLayout from '@/components/layout/page-layout'
import { ContentBox } from '@/components/ui/content-box'
import MonthlyUsage from '@/components/usage/monthly-usage'
import { useAppContext } from '@/contexts/app-context'
import { withAuth } from '@/contexts/withAuth'
import { isEnterprise } from '@/lib/domain/billing'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

const UsagePage: FC = () => {
  const { organization } = useAppContext()
  const router = useRouter()
  if (!organization) return <></>

  if (isEnterprise(organization)) {
    // Enterprise users should not access this page
    router.push('/organization')
    return <></>
  }

  return (
    <PageLayout>
      <Head>
        <title>Usage - Dataherald API</title>
      </Head>
      <div className="flex flex-col gap-5 p-6">
        <ContentBox className="max-w-2xl h-[600px]">
          <MonthlyUsage />
        </ContentBox>
      </div>
    </PageLayout>
  )
}

export default withAuth(UsagePage)
