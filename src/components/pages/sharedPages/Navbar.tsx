"use client";

import { Menu, BookOpen, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useTransition } from "react";
import BecomeTutorButton from "../homePage/BecomeTutorButton";
import { logout } from "@/services/auth.service";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  user?: { name: string; email: string; role?: string } | null;
  menu?: MenuItem[];
}

const defaultMenu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Find Tutors", url: "/tutors" },
  { title: "Student Reviews", url: "/reviews" },

];

function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => logout())}
      className="rounded-lg border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-medium"
    >
      {isPending ? "Logging out..." : "Log Out"}
    </Button>
  );
}

const Navbar = ({ className, user, menu = defaultMenu }: NavbarProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        {/* ── DESKTOP ── */}
        <nav className="hidden lg:flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
                <BookOpen size={15} className="text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900">
                Skill<span className="text-emerald-600">Bridge</span>
              </span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <BecomeTutorButton
                  role={user.role}
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-sm px-3 h-9 transition-colors cursor-pointer"
                >
                  Become a Tutor
                </BecomeTutorButton>

                <Button
                  asChild
                  size="sm"
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                </Button>

                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block">
                    <p className="text-xs font-semibold text-zinc-900 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-tight">
                      {user.email}
                    </p>
                  </div>
                </div>
                <LogoutButton />
              </div>
            ) : (
              <>
                <BecomeTutorButton className="inline-flex items-center justify-center rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-sm px-3 h-9 transition-colors cursor-pointer">
                  Become a Tutor
                </BecomeTutorButton>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-zinc-600 hover:text-zinc-900 font-medium rounded-lg"
                >
                  <a href="/login">Login</a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 font-semibold shadow-sm"
                >
                  <a href="/register">Register</a>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* ── MOBILE ── */}
        <div className="flex lg:hidden items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <BookOpen size={13} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900">
              Skill<span className="text-emerald-600">Bridge</span>
            </span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border-zinc-200"
              >
                <Menu className="size-4 text-zinc-600" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-75 overflow-y-auto border-l border-zinc-100 p-0"
            >
              <SheetHeader className="px-5 pt-5 pb-4 border-b border-zinc-100">
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <BookOpen size={13} className="text-white" />
                  </div>
                  <span className="text-base font-bold tracking-tight">
                    Skill<span className="text-emerald-600">Bridge</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 p-5">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-1"
                >
                  {menu.map((item) => renderMobileMenuItem(item))}
                </Accordion>

                <div className="h-px bg-zinc-100" />

                <div className="flex flex-col gap-2">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 px-1">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                            {user.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-zinc-400">{user.email}</p>
                        </div>
                      </div>
                      <BecomeTutorButton
                        role={user?.role}
                        className="w-full inline-flex items-center justify-center rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-sm px-3 h-9 transition-colors cursor-pointer"
                      >
                        Become a Tutor
                      </BecomeTutorButton>

                      <Button
                        asChild
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold gap-2"
                      >
                        <Link href="/dashboard">
                          <LayoutDashboard size={14} />
                          Dashboard
                        </Link>
                      </Button>
                      <LogoutButton />
                    </div>
                  ) : (
                    <>
                      <BecomeTutorButton className="w-full inline-flex items-center justify-center rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-sm px-3 h-9 transition-colors cursor-pointer">
                        Become a Tutor
                      </BecomeTutorButton>

                      <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-lg border-zinc-200 font-medium"
                      >
                        <a href="/login">Login</a>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                      >
                        <a href="/register">Register</a>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

/* ── DESKTOP MENU ITEM ── */
const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-sm font-medium text-zinc-500 hover:text-zinc-900 bg-transparent hover:bg-zinc-50 rounded-lg h-9 px-3">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-white border border-zinc-100 shadow-lg rounded-xl p-2">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 hover:bg-zinc-50"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

/* ── MOBILE MENU ITEM ── */
const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-2 px-3 text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:no-underline rounded-lg hover:bg-zinc-50">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-1 pl-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }
  return (
    <a
      key={item.title}
      href={item.url}
      className="flex items-center px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-emerald-600 hover:bg-zinc-50 rounded-lg transition-colors"
    >
      {item.title}
    </a>
  );
};

/* ── SUBMENU LINK ── */
const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      href={item.url}
      className="flex flex-row gap-3 rounded-lg p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-zinc-50 hover:text-zinc-900 group"
    >
      {item.icon && (
        <div className="mt-0.5 w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-100 transition-colors">
          {item.icon}
        </div>
      )}
      <div>
        <div className="text-sm font-semibold text-zinc-900">{item.title}</div>
        {item.description && (
          <p className="text-xs leading-snug text-zinc-400 mt-0.5">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
