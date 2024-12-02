'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/utils/actions";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";

function LoginButton() {
  const { pending, data, action } = useFormStatus()

  const handleClick = (event: any) => {
    if (pending) {
      console.log(data, action);
      event.preventDefault()
    }
  }

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <Button aria-disabled={pending} className="w-full" type="submit" variant="success" onClick={handleClick}>
        Registrar usuario
      </Button>
    </div>
  )
}

export default function LogIn() {
  const [message, dispatch] = useFormState(signUpAction, undefined)
  return (<>
    <div className="items-center w-full md:flex md:justify-center">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-background rounded w-full h-full md:h-auto md:max-w-screen-md ">
        <div className="">
          <Image
            alt="Toronja Lab logo"
            src="/logo.png"
            className="mx-auto h-20 w-auto"
            width={120}
            height={80}
            style={{ objectFit: 'contain' }}
          />
          <h2 className="mt-10 text-center leading-9  text-3xl font-semibold tracking-tight first:mt-0">
            Registrar usuario
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={dispatch} className="space-y-6">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium leading-6">
                Usuario
              </label>
              <div className="mt-2">
                <Input
                  id="usuario"
                  name="usuario"
                  type="text"
                  required
                  autoComplete="username"
                  className="block rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="contrasena" className="block text-sm font-medium leading-6">
                  Contraseña
                </Label>
              </div>
              <div className="mt-2">
                <Input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>{message ? <p>{message}</p> : null}</div>
            <LoginButton />
          </form>
        </div>
      </div>
    </div>
  </>)
}
