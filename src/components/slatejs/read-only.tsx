"use client"
import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

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

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable readOnly />
    </Slate>
  )
}

export default ReadOnlyText