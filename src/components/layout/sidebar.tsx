"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Coffee,
  Receipt,
  FileText,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, APP_NAME } from "@/constants";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

const iconMap = {
  LayoutDashboard,
  Users,
  Coffee,
  Receipt,
  FileText,
} as const;

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(255,196,0,0.18)]"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            id={`nav-${item.label.toLowerCase()}`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-sm">
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-5">
          <Image
            src="/clicksip-logo.png"
            alt="Click Sip logo"
            width={42}
            height={46}
            className="h-11 w-10 rounded-md object-cover"
            priority
          />
          <div>
            <span className="block text-lg font-black tracking-tight text-sidebar-foreground">
              {APP_NAME}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Billing
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavLinks />
        </div>
        <div className="border-t border-sidebar-border p-4 flex justify-center">
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-sidebar-border bg-sidebar/95 backdrop-blur-sm px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                id="mobile-menu-toggle"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex h-14 items-center gap-2 px-6 border-b border-border">
              <Image
                src="/clicksip-logo.png"
                alt="Click Sip logo"
                width={28}
                height={31}
                className="h-8 w-7 rounded object-cover"
              />
              <span className="font-bold">{APP_NAME}</span>
            </div>
            <div className="py-4">
              <NavLinks onClick={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1 flex items-center gap-2">
          <Image
            src="/clicksip-logo.png"
            alt="Click Sip logo"
            width={28}
            height={31}
            className="h-8 w-7 rounded object-cover"
          />
          <span className="font-semibold">{APP_NAME}</span>
        </div>
        <ThemeToggle />
      </header>
    </>
  );
}
