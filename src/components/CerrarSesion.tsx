'use client'

import { DisclosureButton, MenuItem } from "@headlessui/react";
import { cerrarSesionAction } from "../utils/actions";

export default function CerrarSesion({ mobile }: { mobile?: boolean }) {
  return mobile ? (
    <DisclosureButton
      as="button"
      key={'cerrarSesion'}
      onClick={() => cerrarSesionAction()}
      className="w-full text-start block rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-700 hover:text-white"
    >
      Cerrar sesión
    </DisclosureButton>
  ) : (
    <MenuItem key={'cerrarSesion'}>
      <button type='button' onClick={() => cerrarSesionAction()} className="w-full text-start block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 data-[focus]:bg-gray-100 dark:data-[focus]:bg-gray-900">
        Cerrar sesión
      </button>
    </MenuItem>
  )
}