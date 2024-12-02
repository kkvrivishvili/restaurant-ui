"use client";

import { products, categories, APP_CONSTANTS } from "@/data";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Snowflake,
  Flame,
  Beef,
  Cookie,
  Scale,
  Star,
  Leaf,
  ChefHat,
} from "lucide-react";
import { useState } from "react";

const SingleProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const product = products.find((item) => item.id === parseInt(id as string));

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
    addToCart(product.id);
  };

  return (
    <Container className="py-8">
      <div className="rounded-lg border bg-card">
        <div className="flex flex-col md:flex-row md:gap-8 p-6">
          {/* IMAGE CONTAINER */}
          <div className="md:w-1/2">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                src={product.img}
                alt={product.title}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.discount && (
                <Badge className="absolute top-4 right-4">
                  -{product.discount}%
                </Badge>
              )}
            </div>
          </div>

          {/* TEXT CONTAINER */}
          <div className="md:w-1/2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  {categories[product.category].title}
                </Badge>
                {product.rating && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Star
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                    />
                    {product.rating}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                {product.title}
              </h1>
              <p className="text-muted-foreground">{product.desc}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(product.dietaryInfo).map(
                ([key, value]) =>
                  value && (
                    <Badge
                      key={key}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Leaf className="w-4 h-4" />
                      {
                        APP_CONSTANTS.DIETARY_TAGS[
                          key as keyof typeof APP_CONSTANTS.DIETARY_TAGS
                        ]
                      }
                    </Badge>
                  )
              )}
            </div>

            {/* Nutritional Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                Información Nutricional
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-3 bg-background rounded-lg">
                  <Flame className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-lg font-bold text-foreground">
                    {product.nutritionalInfo.calories}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Calorías
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-background rounded-lg">
                  <Beef className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-lg font-bold text-foreground">
                    {product.nutritionalInfo.protein}g
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Proteínas
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-background rounded-lg">
                  <Cookie className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-lg font-bold text-foreground">
                    {product.nutritionalInfo.carbs}g
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Carbohidratos
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-background rounded-lg">
                  <Scale className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-lg font-bold text-foreground">
                    {product.nutritionalInfo.fat}g
                  </span>
                  <span className="text-sm text-muted-foreground">Grasas</span>
                </div>
              </div>
            </div>

            {/* Preparation Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                Preparación y Conservación
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                  <ChefHat className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <div className="font-semibold text-foreground">
                      Preparación
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.preparationInfo.heatingTime} min
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                  <Snowflake className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <div className="font-semibold text-foreground">
                      Conservación
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.storageInfo.shelfLife} días
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-foreground">
                  ${(product.price / 100).toFixed(2)}
                </span>
                {product.discount && (
                  <span className="ml-2 text-lg line-through text-muted-foreground">
                    $
                    {(
                      (product.price * (100 + product.discount)) /
                      10000
                    ).toFixed(2)}
                  </span>
                )}
              </div>
              <Button size="lg" onClick={handleAddToCart}>
                Agregar al Carrito
              </Button>
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
