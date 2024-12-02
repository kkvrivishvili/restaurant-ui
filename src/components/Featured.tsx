"use client";

import { products, APP_CONSTANTS } from "@/data";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Flame, Clock, Star, BadgePercent, Award, Leaf } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const Featured = () => {
  const { addToCart } = useCart();
  const promotionalProducts = products
    .filter(
      (product) =>
        product.tags.includes(APP_CONSTANTS.MEAL_TAGS.PROMOTION) ||
        product.tags.includes(APP_CONSTANTS.MEAL_TAGS.POPULAR) ||
        product.tags.includes(APP_CONSTANTS.MEAL_TAGS.BESTSELLER)
    )
    .slice(0, 3);

  if (promotionalProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 bg-secondary/10">
      <Container>
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotionalProducts.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image Section */}
              <div className="relative h-48 w-full">
                <Link href={`/product/${item.id}`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {item.discount && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <BadgePercent className="w-4 h-4" />-{item.discount}%
                    </Badge>
                  )}
                  {item.tags.includes(APP_CONSTANTS.MEAL_TAGS.POPULAR) && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Star className="w-4 h-4" />
                      Popular
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="space-y-2">
                <Link href={`/product/${item.id}`}>
                  <h3 className="text-xl font-semibold hover:text-muted-foreground transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {item.desc}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Info Icons */}
                <div className="flex flex-wrap gap-4">
                  <div
                    className="flex items-center gap-1 text-sm text-muted-foreground"
                    title="Calorías"
                  >
                    <Flame className="w-4 h-4" />
                    <span>{item.nutritionalInfo.calories} kcal</span>
                  </div>
                  <div
                    className="flex items-center gap-1 text-sm text-muted-foreground"
                    title="Tiempo de preparación"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{item.preparationInfo.heatingTime} min</span>
                  </div>
                  {item.dietaryInfo.isGlutenFree && (
                    <div
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                      title="Sin Gluten"
                    >
                      <Award className="w-4 h-4" />
                      <span>Sin Gluten</span>
                    </div>
                  )}
                  {item.dietaryInfo.isVegan && (
                    <div
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                      title="Vegano"
                    >
                      <Leaf className="w-4 h-4" />
                      <span>Vegano</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">${item.price}</p>
                    {item.discount && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${Math.round(item.price * (1 + item.discount / 100))}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => addToCart(item)}
                    size="sm"
                    className="rounded-full"
                  >
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Featured;
