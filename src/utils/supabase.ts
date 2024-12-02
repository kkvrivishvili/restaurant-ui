'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/supabase'

// Crear una instancia del cliente de Supabase para el navegador
const createBrowserClient = () => {
  return createClientComponentClient<Database>()
}

// Exportar una única instancia del cliente
const supabase = createBrowserClient()

export default supabase
