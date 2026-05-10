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
import { logout } from "@/services/auth.service";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  className?: string;
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
  {
    title: "Resources",
    url: "#",
    items: [
      {
        title: "Student Reviews",
        url: "/reviews",
        description: "See what our students have to say about their experience.",
        icon: <BookOpen className="size-4" />,
        className: "border border-red-500",
      },
      {
        title: "About Us",
        url: "/about",
        description: "Learn more about our mission and vision.",
        icon: <BookOpen className="size-4" />,
      },
      {
        title: "Privacy Policy",
        url: "/privacy",
        description: "Read our privacy policy and data protection guidelines.",
        icon: <BookOpen className="size-4" />,
      },
    ],
  },
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
];


function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => logout())}
      className="rounded-lg border-border text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted text-sm font-medium"
    >
      {isPending ? "Logging out..." : "Log Out"}
    </Button>
  );
}

const Navbar = ({ className, user, menu = defaultMenu }: NavbarProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="container mx-auto px-4">

        <nav className="hidden lg:flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
                <BookOpen size={15} className="text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">
                Skill<span className="text-emerald-600">Bridge</span>
              </span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                {menu.map((item) => renderMenuItem(item))}
                {user && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/dashboard/bookings"
                      className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      My Bookings
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
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
                    <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block">
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {user.email}
                    </p>
                  </div>
                </div>
                <LogoutButton />
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground font-medium rounded-lg"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 font-semibold shadow-sm"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        <div className="flex lg:hidden items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <BookOpen size={13} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Skill<span className="text-emerald-600">Bridge</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg border-border"
                >
                  <Menu className="size-4 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-75 overflow-y-auto border-l border-border p-0"
              >
                <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
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
                    {user && (
                      <Link
                        href="/dashboard/student/bookings"
                        className="flex items-center px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-emerald-600 hover:bg-muted rounded-lg transition-colors"
                      >
                        My Bookings
                      </Link>
                    )}
                  </Accordion>

                  <div className="h-px bg-border" />

                  <div className="flex flex-col gap-2">
                    {user ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 px-1">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                              {user.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
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
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-lg border-border font-medium"
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                        >
                          <Link href="/register">Register</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted rounded-lg h-9 px-3">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-card border border-border shadow-lg rounded-xl p-2">
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
        className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-2 px-3 text-sm font-semibold text-foreground/80 hover:text-foreground hover:no-underline rounded-lg hover:bg-muted">
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
    <Link
      key={item.title}
      href={item.url}
      className="flex items-center px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-emerald-600 hover:bg-muted rounded-lg transition-colors"
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      href={item.url}
      className="flex flex-row gap-3 rounded-lg p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-foreground group"
    >
      {item.icon && (
        <div className="mt-0.5 w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
          {item.icon}
        </div>
      )}
      <div>
        <div className="text-sm font-semibold text-foreground">{item.title}</div>
        {item.description && (
          <p className="text-xs leading-snug text-muted-foreground mt-0.5">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar };
