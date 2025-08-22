import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardMain } from "@/components/dashboard-main"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-cs-gray-700 px-4">
        <SidebarTrigger className="text-cs-white hover:bg-cs-gray-800" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-cs-white">Dashboard Principal</h1>
        </div>
      </header>
      <div className="flex-1 p-6">
        <DashboardMain />
      </div>
    </div>
  )
}
