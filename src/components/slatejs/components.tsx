import React, { ReactNode, Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import { cx, css } from '@emotion/css'
import { cn } from "@/lib/utils"

import { ClassValue } from 'clsx'

interface BaseProps {
  className?: ClassValue
  [key: string]: any
}
type OrNull<T> = T | null

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
        reversed ? active ? "text-white" : "text-gray-300" : active ? "text-black" : "text-gray-400",
        className
      )}
    />
  )
)


// interface EditorProps extends BaseProps {
//   value: any
// }
// export const EditorValue = React.forwardRef<HTMLElement, PropsWithChildren<EditorProps>>(
//   ({ className, value, ...props }, ref) => {
//     const textLines = value.document.nodes
//       .map(node => node.text)
//       .toArray()
//       .join('\n')
//     return (
//       <div
//         ref={ref}
//         {...props}
//         className={cn(
//           className,
//           css`
//             margin: 30px -20px 0;
//           `
//         )}
//       >
//         <div
//           className={css`
//             font-size: 14px;
//             padding: 5px 20px;
//             color: #404040;
//             border-top: 2px solid #eeeeee;
//             background: #f8f8f8;
//           `}
//         >
//           Slate's value as text
//         </div>
//         <div
//           className={css`
//             color: #404040;
//             font: 12px monospace;
//             white-space: pre-wrap;
//             padding: 10px 20px;
//             div {
//               margin: 0 0 0.5em;
//             }
//           `}
//         >
//           {textLines}
//         </div>
//       </div>
//     )
//   }
// )

// export const Icon = React.forwardRef<HTMLSpanElement, PropsWithChildren<BaseProps>>(
//   ({ className, ...props }, ref) => (
//     <span
//       {...props}
//       ref={ref}
//       className={cn(
//         "text-base align-text-bottom",
//         className,
//       )}
//     />
//   )
// )

export const Instruction = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `
      )}
    />
  )
)

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }

          & > * + * {
            margin-left: 15px;
          }
        `
      )}
    />
  )
)

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `
      )}
    />
  )
)