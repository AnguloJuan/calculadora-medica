'use client'
import { authenticateAction } from "@/utils/actions";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";

function LoginButton() {
  const { pending } = useFormStatus()

  const handleClick = (event: any) => {
    if (pending) {
      event.preventDefault()
    }
  }

  return (
    <button aria-disabled={pending} type="submit" onClick={handleClick}>
      Iniciar sesión
    </button>
  )
}

export default function LogIn() {
  const [errorMessage, dispatch] = useFormState(authenticateAction, undefined)
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>{errorMessage ? <p>{errorMessage}</p> : null}</div>
            <LoginButton />
          </form>
        </div>
      </div>
    </>
  )
}
