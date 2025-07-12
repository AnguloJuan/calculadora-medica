'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIAS } from "../../utils/types";
import { Each } from "../EachOf";

export default function NavOpcion({ mobile }: { mobile?: boolean }) {
  const enrutador = usePathname();
  const categoriaActual = enrutador.split('/')[2];

  return (
    <Each of={CATEGORIAS} render={(item, index) => (
      <Link
        key={index}
        href={`/calculadoras/${item.kebabCase}`}
        aria-current={item.kebabCase === categoriaActual ? 'page' : undefined}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3",
          categoriaActual === item.kebabCase && "bg-accent text-accent-foreground dark:bg-accent/80"
        )}
      >
        {item.nombre}
        {categoriaActual === item.kebabCase && <span className="sr-only">(current)</span>}
      </Link>

    )}
    />
  )
}