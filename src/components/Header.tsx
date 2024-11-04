import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import CerrarSesion from "./CerrarSesion";
import NavOpcion from "./NavOpcion";

// const user = {
//   name: 'Admin',
//   email: 'admin',
//   imageUrl:
//     '/../../vercel.svg',
// }
const userNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  // { name: 'Cerrar sesión', href: '/cerrar-sesion' },
]

export default async function Header({ rol }: { rol?: string }) {
  return (
    <div className="w-full">
      <Disclosure as="nav" className="sticky top-0 z-40 backdrop-blur flex-none transition-colors duration-500
             dark:border-slate-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75
            border-b border-slate-900/10 lg:px-8">
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
                {/* <button
                                    type="button"
                                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <IconBell aria-hidden="true" className="h-6 w-6" />
                                </button> */}

                {rol === 'admin' && (
                  <Menu as="div" className="relative ml-3 md:block">
                    <div>
                      <MenuButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-800 p-2 
                            text-slate-600 dark:text-slate-400 hover:bg-gray-700
                            hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Abrir menu de usuario</span>
                        {/* <Image
                        alt=""
                        src={user.imageUrl}
                        width={32}
                        height={32}
                        className="rounded-full"
                      /> */}
                        <IconMenu2 aria-hidden="true" className="block h-6 w-6 md:group-data-[active]:hidden" />
                        <IconX aria-hidden="true" className="hidden h-6 w-6 md:group-data-[active]:block" />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 
                                        transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 
                                        data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <a
                            href={item.href}
                            className="items-center block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 data-[focus]:bg-gray-100 dark:data-[focus]:bg-gray-900"
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      ))}
                      <CerrarSesion />
                    </MenuItems>
                  </Menu>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-800 p-2 
                            text-slate-600 dark:text-slate-400 hover:bg-gray-700
                            hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
          {rol === 'admin' && (
            <div className="border-t border-slate-900/20 pb-3 pt-4">
              {/* <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Image
                  alt=""
                  src={user.imageUrl}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none">{user.name}</div>
                <div className="text-sm font-medium leading-none text-slate-600 dark:text-slate-400">{user.email}</div>
              </div>

              <button
                type="button"
                className="relative ml-auto flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-800 p-1 text-slate-600 dark:text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <IconBell aria-hidden="true" className="h-6 w-6" />
              </button>
            </div> */}
              <div className="px-3 text-base font-medium leading-none">Administración</div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
                <CerrarSesion mobile />
              </div>
            </div>
          )}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}