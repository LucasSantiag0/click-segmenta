"use client"

import type * as React from "react"
import { BarChart3, Users, Map, Settings, Home, Target, Filter } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Análise de Segmentos",
      url: "/segments",
      icon: Users,
    },
    {
      title: "Clientes por Cluster",
      url: "/clusters",
      icon: Target,
    },
    {
      title: "Análise de Rotas",
      url: "/routes",
      icon: Map,
    },
    // {
    //   title: "Filtros",
    //   url: "/filters",
    //   icon: Filter,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className="border-r border-cs-gray-700">
      <SidebarHeader className="border-b border-cs-gray-700 p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-cs-yellow" />
          <span className="text-lg font-bold text-cs-white">ClickSegmenta</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-cs-dark">
        <SidebarGroup>
          <SidebarGroupLabel className="text-cs-gray-400">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-cs-gray-300 hover:text-cs-white hover:bg-cs-gray-800 data-[active=true]:bg-cs-blue data-[active=true]:text-cs-white"
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-cs-gray-700 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-cs-gray-300 hover:text-cs-white hover:bg-cs-gray-800">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
