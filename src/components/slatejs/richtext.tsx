"use client"
import isHotkey from 'is-hotkey'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code, Heading1, Heading2, Heading3, Italic, List, ListOrdered, LucideIcon, Quote, Underline } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
} from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact } from 'slate-react'
import { Button, Toolbar } from './components'
import { Noop } from 'react-hook-form'
import { Element, Leaf } from './Elements'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

interface RichTextProps {
  value?: string
  onChange: (...event: any[]) => void
  onBlur?: Noop
  placeholder?: string
}
const RichText = ({ onChange, value, onBlur, placeholder }: RichTextProps) => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  //  validate the value
  const isValueJson = useCallback(() => {// temporary function to validate json
    try {
      JSON.parse(value)
      return true
    } catch (error) {
      console.error('value is not json');
      return false
    }
  }, [value])

  const initialValue = useMemo(() => (value && value !== "" && isValueJson()) ? JSON.parse(value) : defaultValue, [value])

  return (
    <div className='space-y-1'>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={value => {
          if (!onChange) return
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          if (isAstChange) {
            const content = JSON.stringify(value)
            onChange(content)
          }
        }}
      >
        <Toolbar>
          <MarkButton format="bold" Icon={Bold} />
          <MarkButton format="italic" Icon={Italic} />
          <MarkButton format="underline" Icon={Underline} />
          <MarkButton format="code" Icon={Code} />
          <BlockButton format="heading-one" Icon={Heading1} />
          <BlockButton format="heading-two" Icon={Heading2} />
          <BlockButton format="heading-three" Icon={Heading3} />
          <BlockButton format="block-quote" Icon={Quote} />
          <BlockButton format="numbered-list" Icon={ListOrdered} />
          <BlockButton format="bulleted-list" Icon={List} />
          <BlockButton format="left" Icon={AlignLeft} />
          <BlockButton format="center" Icon={AlignCenter} />
          <BlockButton format="right" Icon={AlignRight} />
          <BlockButton format="justify" Icon={AlignJustify} />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder || "Ingresa el texto…"}
          spellCheck
          onBlur={onBlur}
          className='p-4 pt-0 bg-container form-input border-border rounded'
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

interface ButtonProps {
  format: string
  Icon: LucideIcon
}
const BlockButton = ({ format, Icon }: ButtonProps) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon size={16} className='align-text-bottom' />
    </Button>
  )
}

const MarkButton = ({ format, Icon }: ButtonProps) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon size={16} className='align-text-bottom' />
    </Button>
  )
}

const defaultValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export default RichText