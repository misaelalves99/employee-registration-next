// app/employee/components/ToggleStatusButton.tsx

'use client'

import { useState } from 'react'
import styles from './ToggleStatusButton.module.css'

interface ToggleStatusButtonProps {
  employeeId: number
  initialStatus: boolean
  onStatusChange: (newStatus: boolean) => void
}

export default function ToggleStatusButton({ employeeId, initialStatus, onStatusChange }: ToggleStatusButtonProps) {
  const [isActive, setIsActive] = useState(initialStatus)
  const [loading, setLoading] = useState(false)

  const toggleStatus = async () => {
    setLoading(true)
    const res = await fetch(`/api/employees/${employeeId}/toggle-status`, {
      method: 'POST',
    })
    setLoading(false)

    if (res.ok) {
      const data = await res.json()
      setIsActive(data.isActive)
      onStatusChange(data.isActive)
    } else {
      alert('Erro ao alterar status')
    }
  }

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className={`${styles.button} ${isActive ? styles.active : styles.inactive}`}
      title={isActive ? 'Inativar' : 'Ativar'}
    >
      {loading ? 'Carregando...' : isActive ? 'Ativo' : 'Inativo'}
    </button>
  )
}
