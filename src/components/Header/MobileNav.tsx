"use client"

import { cn } from "@/lib/utils"
import { CATEGORIAS } from "@/utils/types"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { ReactNode, useCallback, useState } from "react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open)
    }, [])

  return (
    <Popover open={open} onOpenChange={onOpenChange} >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={"extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !py-0 !px-2 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-none flex lg:hidden"}
        >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  open ? "top-[0.4rem] -rotate-45" : "top-1"
                )}
              />
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  open ? "top-[0.4rem] rotate-45" : "top-2.5"
                )}
              />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </div>
          <span className="flex h-8 items-center text-lg leading-none font-medium">
            Menu
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background/90 no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100 lg:hidden"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={12}
      >
        <div className="flex flex-col gap-12 overflow-auto">
          <div className="flex flex-col">
            <div className="flex flex-col py-6">
              {CATEGORIAS.map((item, index) => (
                <MobileLink
                  key={index}
                  href={`/calculadoras/${item.kebabCase}`}
                  onOpenChange={setOpen}
                >
                  {item.nombre}
                </MobileLink>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn("text-xl font-medium px-6 py-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground dark:focus-visible:bg-accent/50", className)}
      {...props}
    >
      {children}
    </Link>
  )
}