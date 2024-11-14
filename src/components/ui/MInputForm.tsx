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
  description: string;
  input?: 'input' | 'textarea' | 'checkbox';
  textInputProps?: InputProps;
  textAreaProps?: TextareaProps;
}

export default function FormInput<T extends FieldValues>({ control, name, label, description, input, textInputProps, textAreaProps }: InputFormProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {input === 'input' ? (
              <Input {...field} {...textInputProps} />
            ) : input === 'textarea' ? (
              <Textarea {...field} {...textAreaProps} />
            ) : null}
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}