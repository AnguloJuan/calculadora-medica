"use client"
import { CustomText } from "@/types/slate"
import { useCallback } from "react"
import { RenderElementProps, RenderLeafProps } from "slate-react"

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: (element as any).align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          style={style}
          className='border-l-4 text-muted-foreground pl-4 italic'
          {...attributes}
        >
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul
          style={style}
          className='scroll-m-20 list-disc my-6 ml-6'
          {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1
          style={style}
          className='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0'
          {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2
          style={style}
          className='scroll-m-20 text-2xl font-semibold tracking-tight'
          {...attributes}>
          {children}
        </h2>
      )
    case 'heading-three':
      return (
        <h3
          style={style}
          className='scroll-m-20 text-xl font-semibold tracking-tight'
          {...attributes}>
          {children}
        </h3>
      )
    case 'list-item':
      return (
        <li
          style={style}
          className='my-6 ml-6 [&>li]:mt-2'
          {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol
          style={style}
          className='my-6 ml-6 list-decimal [&>li]:mt-2'
          {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const isCustomText = useCallback((value: any): value is CustomText => {
    return value && typeof value.text === 'string' && (
      value.bold !== undefined ||
      value.italic !== undefined ||
      value.code !== undefined ||
      value.underline !== undefined
    );
  }, [])

  if (isCustomText(leaf)) {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }

    if (leaf.code) {
      children = <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>{children}</code>
    }

    if (leaf.italic) {
      children = <em>{children}</em>
    }

    if (leaf.underline) {
      children = <u>{children}</u>
    }
  }

  return <span {...attributes}>{children}</span>
}