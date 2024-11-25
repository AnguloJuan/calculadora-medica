'use client'

import { authenticateAction } from "@/utils/actions";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { Boton } from "../../components/Botones";

function LoginButton() {
  const { pending } = useFormStatus()

  const handleClick = (event: any) => {
    if (pending) {
      event.preventDefault()
    }
  }

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <Boton aria-disabled={pending} type="submit" variante="success" onClick={handleClick}>
        Iniciar sesión
      </Boton>
    </div>
  )
}

export default function LogIn() {
  const [errorMessage, dispatch] = useFormState(authenticateAction, undefined)
  return (<>
    <div className="h-full min-h-full items-center w-full md:flex md:justify-center">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-backgroud rounded w-full h-full md:h-auto md:max-w-screen-md ">
        <div className="">
          <Image
            alt="Toronja Lab logo"
            src="/logo.png"
            className="mx-auto h-20 w-auto"
            width={120}
            height={80}
            style={{ objectFit: 'contain' }}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Iniciar sesión
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={dispatch} className="space-y-6">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium leading-6 text-gray-900">
                Usuario
              </label>
              <div className="mt-2">
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  required
                  autoComplete="username"
                  className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="contrasena" className="block text-sm font-medium leading-6 text-gray-900">
                  Contraseña
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>{errorMessage ? <p>{errorMessage}</p> : null}</div>
            <LoginButton />
          </form>
        </div>
      </div>
    </div>
  </>)
}
