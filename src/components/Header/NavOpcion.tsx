'use client'

import { DisclosureButton } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIAS } from "../../utils/types";

export default function NavOpcion({ mobile }: { mobile?: boolean }) {
  const enrutador = usePathname();
  const categoriaActual = enrutador.split('/')[2];

  const navigation = CATEGORIAS.map((categoria) => ({
    name: categoria.nombre,
    href: `/calculadoras/${categoria.kebabCase}`,
    current: categoria.kebabCase === categoriaActual,
  }))

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return mobile ? navigation.map((item, index) => (
    <DisclosureButton
      key={index}
      as="a"
      href={item.href}
      aria-current={item.current ? 'page' : undefined}
      className={classNames(
        item.current ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-accent',
        'block rounded-md px-3 py-2 text-base font-medium',
      )}
    >
      {item.name}
    </DisclosureButton>
  )) : navigation.map((item, index) => (
    <Link
      key={index}
      href={item.href}
      aria-current={item.current ? 'page' : undefined}
      className={classNames(
        item.current ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-accent',
        'rounded-md px-3 py-2 text-sm font-medium',
      )}
    >
      {item.name}
    </Link>
  ))
}