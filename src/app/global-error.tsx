// app/global-error.tsx
'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body className="flex items-center justify-center h-screen bg-red-100 text-red-800">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Ocorreu um erro.</h1>
          <p>Desculpe, algo deu errado. Tente novamente mais tarde.</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </body>
    </html>
  )
}
