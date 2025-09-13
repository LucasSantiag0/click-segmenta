import { SidebarTrigger } from "@/components/ui/sidebar"
import { SegmentsAnalysis } from "@/components/segments-analysis"

export default function SegmentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-cs-gray-700 px-4">
        <SidebarTrigger className="text-cs-white hover:bg-cs-gray-800" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-cs-white">Análise de Segmentos</h1>
        </div>
      </header>
      <div className="flex-1 p-6">
        <SegmentsAnalysis />
      </div>
    </div>
  )
}
