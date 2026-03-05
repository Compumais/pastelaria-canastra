"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Link } from "./link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NavLink = { href: string; title: string };

const adminLinks: NavLink[] = [
  { href: "/dashboard", title: "Dashboard" },
  { href: "/funcionarios", title: "Funcionarios" },
  { href: "/comandas", title: "Comandas" },
  { href: "/fechamentos", title: "Fechamentos" },
  { href: "/relatorios", title: "Relatórios" },
  { href: "/configuracoes", title: "Configurações" },
];

const userLinks: NavLink[] = [
  { href: "/", title: "Início" },
  { href: "/comandas", title: "Comandas" },
  { href: "/configuracoes", title: "Configurações" },
];

const guestLinks: NavLink[] = [
  { href: "/configuracoes", title: "Configurações" },
];

export function Header() {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const renderLinks = (links: NavLink[]) => {
    return links.map(({ href, title }) => (
      <Link key={href} href={href} title={title} />
    ));
  };

  const linksToRender = isAuthenticated
    ? isAdmin
      ? adminLinks
      : userLinks
    : guestLinks;

  return (
    <header className="w-full h-24 flex items-center justify-between bg-gray-200 px-10 py-5 max-sm:px-5">
      <h1 className="text-2xl text-blue-600 font-extrabold max-sm:text-xs">
        Pastelaria Canastra
      </h1>

      {/* NAV VISÍVEL EM TELAS MAIORES */}
      <nav className="hidden md:flex items-center gap-4 font-semibold">
        {!isAuthenticated && (
          <div className="flex items-center gap-4">
            {renderLinks(linksToRender)}
          </div>
        )}

        {isAuthenticated && (
          <div className="block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-8 h-8" variant="ghost" size="icon">
                  <Menu size={32} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Páginas</DropdownMenuLabel>
                <DropdownMenuSeparator className="border-gray-900" />
                {linksToRender.map(({ href, title }) => (
                  <DropdownMenuItem key={href} asChild>
                    <a href={href}>{title}</a>
                  </DropdownMenuItem>
                ))}

                {isAuthenticated && (
                  <>
                    <DropdownMenuSeparator className="border-gray-900" />
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={handleLogout}
                    >
                      Sair
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          // <>
          //   <div className="h-12 border border-gray-700" />
          //   <Button
          //     onClick={handleLogout}
          //     className="text-red-400 font-semibold cursor-pointer"
          //     aria-label="Sair da conta"
          //     title="Sair"
          //   >
          //     <LogOut />
          //   </Button>
          // </>
        )}
      </nav>
    </header>
  );
}
