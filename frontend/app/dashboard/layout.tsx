import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { ProtectedRoute } from '@/components/protected-route'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[1600px] mx-auto pt-24 px-6 flex gap-6 pb-12">
          <Sidebar />
          <main className="flex-1 flex flex-col gap-6 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
