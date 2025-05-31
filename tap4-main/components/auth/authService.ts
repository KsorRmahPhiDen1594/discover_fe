'use client'

import { createClient } from '../../db/supabase/client'

const supabase = createClient()

export const authService = {
  // Đăng ký user với email, password và fullName (lưu thêm thông tin fullName vào bảng profile nếu có)
  async registerWithEmail({
    email,
    password,
    fullName,
  }: {
    email: string
    password: string
    fullName?: string
  }) {
    // 1. Đăng ký auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      return { error: signUpError }
    }
    return { data: signUpData }
  },

  // Đăng nhập
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Đăng xuất
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Lấy user hiện tại
  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },
}
