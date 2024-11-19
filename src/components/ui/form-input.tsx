"use client"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Textarea, TextareaProps } from "./textarea";

interface InputFormProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  input?: 'input' | 'textarea';
  textInputProps?: InputProps;
  textAreaProps?: TextareaProps;
}

const FormInput = <T extends FieldValues>({ control, name, label, description, input = "input", placeholder, textInputProps, textAreaProps }: InputFormProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {input === 'input' ? (
              <Input {...field} placeholder={placeholder} {...textInputProps} />
            ) : input === 'textarea' ? (
              <Textarea {...field} placeholder={placeholder} {...textAreaProps} />
            ) : null}
          </FormControl>
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormInput;