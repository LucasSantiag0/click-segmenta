import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { FiltersProvider } from "@/contexts/filters-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClickSegmenta - Dashboard",
  description: "Dashboard de Ciência de Dados para Segmentação de Clientes",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <FiltersProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-cs-dark">
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </SidebarProvider>
        </FiltersProvider>
      </body>
    </html>
  )
}
