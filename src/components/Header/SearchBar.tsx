"use client"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (<>
    <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none border rounded-md">
      <Button
        data-slot="dialog-trigger"
        className="transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-secondary/80 px-4 py-2 bg-surface text-muted-foreground dark:bg-background relative h-8 w-full justify-start pl-2.5 shadow sm:pr-12 md:w-40 lg:w-56 xl:w-64 hover:text-accent-foreground dark:hover:bg-accent/50"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        data-state="closed"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Buscar calculadora...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
          <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none">Ctrl</kbd>
          <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none aspect-square">K</kbd>
        </div>
      </Button>
      <Command className="border-none">
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Buscar calculadora..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Resultados">
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Command>
    </div>
  </>
  )
}