'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/components/auth/authService'
import { Input } from '@/components/ui/input'

export default function RegisterForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await authService.registerWithEmail({ email, password, fullName })

    if (error) {
      setErrorMsg(error.message || 'Đăng ký thất bại.')
      setLoading(false)
      return
    }

    // Đăng ký thành công, chuyển hướng về trang đăng nhập
    router.push('/auth/login')
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Đăng ký</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="text"
          placeholder="Họ tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>

      {/* Nút chuyển đến trang đăng nhập */}
      <div className="mt-4 text-center">
        <p>
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </div>
  )
}
