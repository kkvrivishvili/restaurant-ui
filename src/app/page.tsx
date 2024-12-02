/**
 * HomePage: Página principal de la aplicación
 * 
 * Secciones:
 * - Hero: Banner principal con imagen y CTA
 * - Categorías destacadas
 * - Productos populares
 * - Newsletter signup (opcional)
 * 
 * Componentes:
 * - Container: Layout container (@/components/ui/container.tsx)
 * - MenuCard: Cards de productos (@/components/ui/menu-card.tsx)
 * - Button: Botones CTA (@/components/ui/button.tsx)
 * 
 * Datos:
 * - Productos desde @/data.ts
 * - Categorías desde APP_CONSTANTS
 * 
 * Features:
 * - Lazy loading de imágenes con next/image
 * - Responsive design (móvil y desktop)
 * - Integración con carrito
 * 
 * Performance:
 * - Componentes server-side por default
 * - Optimización de imágenes automática
 * - Prefetch de rutas comunes
 * 
 * SEO:
 * - Metadata en layout.tsx
 * - Títulos y descripciones dinámicas
 */

import Featured from '@/components/Featured'
import Offer from '@/components/Offer'
import Slider from '@/components/Slider'
import { Container } from '@/components/ui/container'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-8 pb-8">
      <Slider />
      <Container>
        <Featured />
      </Container>
      <Container>
        <Offer />
      </Container>
    </div>
  )
}
