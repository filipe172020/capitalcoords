import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { User } from "lucide-react"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <>

          <header className="flex h-32 items-center justify-between px-6 border-b bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Logo" className="h-28 w-28" />
            </div>

            <div className="flex items-center gap-4">
              <Button className="text-sm font-medium  text-muted-foreground text-white h-12">
                <User className="size-4" /> Cadastre-se
              </Button>
              <button className="text-sm font-medium hover:underline text-muted-foreground">
                Suporte
              </button>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                U
              </div>
            </div>
          </header>


        </>
      </SidebarInset>
    </SidebarProvider>
  )
}
