"use client"
import { cn } from "@/lib/utils"
import React, { PropsWithChildren } from 'react'

import { ClassValue } from 'clsx'

interface BaseProps {
  className?: ClassValue
  [key: string]: any
}

interface ButtonProps extends BaseProps {
  active: boolean
  reversed: boolean
}

export const Button = React.forwardRef<HTMLSpanElement, PropsWithChildren<ButtonProps>>(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}

      className={cn(
        "cursor-pointer",
        reversed ? active ? "text-accent-foreground" : "text-muted-foreground" : active ? "text-accent-foreground" : "text-muted-foreground",
        className
      )}
    />
  )
)

export const Menu = React.forwardRef<HTMLDivElement, PropsWithChildren<BaseProps>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      className={cn(
        className,
        "space-x-4 [&>*]:inline-block"
      )}
    />
  )
)

export const Toolbar = React.forwardRef<HTMLDivElement, PropsWithChildren<BaseProps>>(
  ({ className, ...props }, ref) => (
    <Menu
      {...props}
      ref={ref}
      className={cn(
        className,
        "relative p-1 border-b-2 border-gray-200"
      )}
    />
  )
)