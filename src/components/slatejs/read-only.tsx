// @ts-nocheck
"use client"
import { useCallback, useMemo } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { Element, Leaf } from './Elements'

const ReadOnlyText = ({ value }: { value: string }) => {
  const editor = useMemo(() => withReact(createEditor()), [])
  //  validate the value
  const isValueJson = (value: string) => {// temporary function to validate json
    try {
      JSON.parse(value)
      return true
    } catch (error) {
      return false
    }
  }
  if (!isValueJson(value)) {
    console.log('value is not json');

    return <p className="leading-7">{value}</p>
  }
  const initialValue = useMemo(() => JSON.parse(value), [value])
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        readOnly
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  )
}

export default ReadOnlyText