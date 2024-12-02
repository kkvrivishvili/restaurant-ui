import { ReactNode } from 'react'
import { DashboardProviders } from './providers'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardProviders attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen">
        {children}
      </div>
    </DashboardProviders>
  )
}
