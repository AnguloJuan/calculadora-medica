import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import NavOpcion from "./NavOpcion";
import { ModeToggle } from "./mode-toggle";

export default async function Header({ rol }: { rol?: string }) {
  return (
    <div className="w-full">
      <Disclosure as="nav" className="top-0 z-40 backdrop-blur flex-none transition-colors duration-500 bg-background supports-backdrop-blur:bg-background/95 border-b lg:px-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image
                  alt="ToronjaLab"
                  src="/logo.png"
                  width={100}
                  height={40}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <NavOpcion />
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <ModeToggle />
              </div>
            </div>
            <div className="-mr-2 flex gap-4 md:hidden">
              {/* Mobile menu button */}
              <ModeToggle />
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md 
                             focus:outline-none focus:ring-2  focus:ring-offset-2 ">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Abrir menu</span>
                <IconMenu2 aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <IconX aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <NavOpcion mobile />
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}