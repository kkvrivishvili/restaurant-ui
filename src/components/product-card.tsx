import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { type Product } from "@/hooks/useStore";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <Link href={`/product/${product.id}`}>
        <CardHeader className="p-0">
          <div className="aspect-square relative">
            <Image
              src={product.image_url || "/placeholder.png"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">
              {product.rating} ({product.reviews_count} reseñas)
            </span>
          </div>
          {product.discount_price && (
            <Badge variant="secondary" className="mt-2">
              Ahorro: ${(product.price - product.discount_price) / 100}
            </Badge>
          )}
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            {product.discount_price ? (
              <>
                <span className="text-lg font-bold">
                  ${product.discount_price / 100}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price / 100}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">${product.price / 100}</span>
            )}
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            disabled={!product.is_active || product.stock_quantity === 0}
          >
            {product.stock_quantity === 0
              ? "Sin stock"
              : !product.is_active
              ? "No disponible"
              : "Agregar al carrito"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
