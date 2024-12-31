/**
 * Componente de iconos
 * Utiliza Lucide React para los iconos
 */

import {
  AlertCircle,
  Check,
  Clock,
  Loader2,
  Undo,
  Store,
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  spinner: Loader2,
  check: Check,
  clock: Clock,
  alertCircle: AlertCircle,
  undo: Undo,
  logo: Store,
} as const

export type IconKeys = keyof typeof Icons
