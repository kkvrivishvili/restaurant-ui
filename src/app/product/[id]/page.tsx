"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useCart } from "@/context/CartContext";
import { useStore, type Product } from "@/hooks/useStore";
import {
  Beef,
  ChefHat,
  Cookie,
  Flame,
  Leaf,
  Scale,
  Snowflake
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from '@/components/ui/use-toast'

// Constantes de la aplicación
const APP_CONSTANTS = {
  ICONS: {
    CALORIES: Flame,
    PROTEIN: Beef,
    CARBS: Cookie,
    WEIGHT: Scale,
    FROZEN: Snowflake,
    VEGAN: Leaf,
    CHEF: ChefHat,
  },
  NUTRITIONAL_LABELS: {
    calories: "Calorías",
    protein: "Proteínas",
    carbs: "Carbohidratos",
    weight: "Peso",
  },
  DIETARY_TAGS: {
    vegan: "Vegano",
    glutenFree: "Sin gluten",
    lactoseFree: "Sin lactosa",
    // Agregar más etiquetas dietéticas aquí
  },
};

const SingleProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, categories } = useStore();
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const product = products.find((item: Product) => item.id === id);

  if (!product) {
    return (
      <Container className="py-16">
        <div className="text-center text-muted-foreground">
          Producto no encontrado
        </div>
      </Container>
    );
  }

  const handleMouseEnter = (content: string, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipContent(content);
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id);
    // Eliminamos el toast de aquí ya que se muestra en el CartContext
  };

  return (
    <Container className="py-8">
      <div className="rounded-lg border bg-card">
        <div className="flex flex-col md:flex-row md:gap-8 p-6">
          {/* IMAGE CONTAINER */}
          <div className="md:w-1/2">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                src={product.image_url || "/placeholder.png"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {product.discount_price && (
                    <span>
                      -{Math.round(
                        ((product.price - product.discount_price) / product.price) * 100
                      )}%
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* INFO CONTAINER */}
          <div className="md:w-1/2 space-y-6">
            {/* Title and Description */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Dietary Info */}
            {product.product_details?.dietary_info && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Información Dietética</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(product.product_details.dietary_info as Record<string, boolean>).map(
                    ([key, value]) =>
                      value && (
                        <Badge key={key} variant="outline">
                          {key === "isGlutenFree"
                            ? "Sin Gluten"
                            : key === "isDairyFree"
                            ? "Sin Lácteos"
                            : key === "isVegan"
                            ? "Vegano"
                            : key === "isNutFree"
                            ? "Sin Frutos Secos"
                            : key === "isSoyFree"
                            ? "Sin Soja"
                            : key}
                        </Badge>
                      )
                  )}
                </div>
              </div>
            )}

            {/* Nutritional Info */}
            {product.product_details?.nutritional_info && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Información Nutricional</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Calories */}
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Calorías</p>
                      <p className="font-medium">
                        {(product.product_details.nutritional_info as any).calories} kcal
                      </p>
                    </div>
                  </div>

                  {/* Protein */}
                  <div className="flex items-center gap-2">
                    <Beef className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Proteínas</p>
                      <p className="font-medium">
                        {(product.product_details.nutritional_info as any).protein}g
                      </p>
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="flex items-center gap-2">
                    <Cookie className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Carbohidratos</p>
                      <p className="font-medium">
                        {(product.product_details.nutritional_info as any).carbs}g
                      </p>
                    </div>
                  </div>

                  {/* Fat */}
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Grasas</p>
                      <p className="font-medium">
                        {(product.product_details.nutritional_info as any).fat}g
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preparation Info */}
            {product.product_details?.preparation_info && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Preparación</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Tiempo de calentado:</span>{" "}
                    {(product.product_details.preparation_info as any).heatingTime} minutos
                  </p>
                  <p>
                    <span className="font-medium">Tamaño de porción:</span>{" "}
                    {(product.product_details.preparation_info as any).servingSize}
                  </p>
                </div>
              </div>
            )}

            {/* Storage Info */}
            {product.product_details?.storage_info && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Almacenamiento</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Vida útil:</span>{" "}
                    {(product.product_details.storage_info as any).shelfLife} días
                  </p>
                  <p>{(product.product_details.storage_info as any).instructions}</p>
                </div>
              </div>
            )}

            {/* Price and Add to Cart */}
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {product.discount_price ? (
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">${product.discount_price}</p>
                      <p className="text-sm text-muted-foreground line-through">
                        ${product.price}
                      </p>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold">${product.price}</p>
                  )}
                </div>
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.is_active || product.stock_quantity === 0}
                >
                  {product.stock_quantity === 0
                    ? "Sin stock"
                    : !product.is_active
                    ? "No disponible"
                    : "Agregar al carrito"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTooltip && (
        <div
          className="fixed z-50 bg-popover text-popover-foreground p-2 rounded-md shadow-lg text-sm"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y + 10,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </Container>
  );
};

export default SingleProductPage;
