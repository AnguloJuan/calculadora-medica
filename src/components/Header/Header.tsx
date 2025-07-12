import Image from "next/image";
import { ModeToggle } from "../mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { MobileNav } from "./MobileNav";
import NavOpcion from "./NavOpcion";
import SearchBar from "./SearchBar";

export default async function Header({ rol }: { rol?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="w-full mx-auto 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-[theme(spacing.14)] items-center gap-2">
          <Image
            alt="ToronjaLab"
            src="/logo.png"
            width={80}
            height={32}
            style={{ objectFit: 'contain' }}
          />
          <nav className="items-center gap-0.5 hidden lg:flex ">
            <NavOpcion />
          </nav>
          <MobileNav />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <SearchBar />
            <ModeToggle />
            {rol === "admin" && <SidebarTrigger variant={"outline"} className="size-8 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-none transition-all" />}
          </div>
        </div>
      </div>
    </header>
  );
}