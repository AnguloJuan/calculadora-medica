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

  return (
    navigation.map((item, index) => (
      <Link
        key={index}
        href={item.href}
        aria-current={item.current ? 'page' : undefined}
        className=
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3"
      >
        {item.name}
        {item.current && <span className="sr-only">(current)</span>}
      </Link>
    ))
  )
}
//   mobile ? navigation.map((item, index) => (
//     <DisclosureButton
//       key={index}
//       as="a"
//       href={item.href}
//       aria-current={item.current ? 'page' : undefined}
//       className={classNames(
//         item.current ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-accent',
//         'block rounded-md px-3 py-2 text-base font-medium',
//       )}
//     >
//       {item.name}
//     </DisclosureButton>
//   )) : navigation.map((item, index) => (
//     <Link
//       key={index}
//       href={item.href}
//       aria-current={item.current ? 'page' : undefined}
//       className={classNames(
//         item.current ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-accent',
//         'rounded-md px-3 py-2 text-sm font-medium',
//       )}
//     >
//       {item.name}
//     </Link>
//   ))