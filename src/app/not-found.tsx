// app/not-found.tsx

'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="text-center mt-20">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Erro 404</h1>
      <p className="text-lg text-gray-700 mb-6">A página que você está procurando não foi encontrada.</p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Voltar à página inicial
      </Link>
    </section>
  )
}
