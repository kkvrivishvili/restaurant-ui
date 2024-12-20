"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useStore, type Filters } from "@/hooks/useStore";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useDebounce } from "@/hooks/useDebounce";

// Tipos para los iconos
interface CategoryIconProps {
  category: string;
}

interface DietaryIconProps {
  tag: string;
}

// Tipo para la página
interface PageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Componente para CategoryIcon
function CategoryIcon({ category }: CategoryIconProps) {
  return (
    <div className={cn("w-4 h-4", category)}>
      {/* Aquí puedes agregar los íconos específicos para cada categoría */}
    </div>
  );
}

// Componente para DietaryIcon
function DietaryIcon({ tag }: DietaryIconProps) {
  return (
    <div className="w-4 h-4">
      {/* Aquí puedes agregar los íconos específicos para cada etiqueta dietética */}
    </div>
  );
}

// Componente StorePage
export default function StorePage() {
  const { products, categories, loading, loadProducts } = useStore();
  const { addToCart } = useCart();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    isGlutenFree: false,
    isDairyFree: false,
    isVegan: false,
    nutritional: {
      minCalories: 0,
      maxCalories: 1000,
      minProtein: 0,
      maxProtein: 100,
      minCarbs: 0,
      maxCarbs: 100,
    },
  });

  const debouncedFilters = useDebounce(filters, 500);
  const isInitialMount = useRef(true);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    console.log('🔄 Aplicando filtros:', debouncedFilters);
    loadProducts(debouncedFilters);
  }, [debouncedFilters, loadProducts]);

  useEffect(() => {
    console.log('📊 Estado actual:', {
      productsCount: products.length,
      categoriesCount: categories.length,
      loading,
    })
  }, [products, categories, loading])

  // Manejadores de filtros
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handlePriceChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }));
  };

  const handleDietaryChange = (key: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNutritionalChange = (
    key: keyof Filters["nutritional"],
    values: number[]
  ) => {
    setFilters(prev => ({
      ...prev,
      nutritional: {
        ...prev.nutritional,
        [key]: values[0],
      },
    }));
  };

  // Renderizar los filtros
  const renderFilters = () => (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Búsqueda</h3>
        <Input
          placeholder="Buscar productos..."
          value={filters.search}
          onChange={e => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Categorías */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Categoría</h3>
        <Select
          value={filters.category}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Precio</h3>
        <div className="pt-2">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Filtros dietéticos */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Preferencias dietéticas</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Sin gluten</span>
            <Switch
              checked={filters.isGlutenFree}
              onCheckedChange={() => handleDietaryChange("isGlutenFree")}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Sin lácteos</span>
            <Switch
              checked={filters.isDairyFree}
              onCheckedChange={() => handleDietaryChange("isDairyFree")}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Vegano</span>
            <Switch
              checked={filters.isVegan}
              onCheckedChange={() => handleDietaryChange("isVegan")}
            />
          </div>
        </div>
      </div>

      {/* Filtros nutricionales */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Información nutricional</h3>
        
        {/* Calorías */}
        <div className="space-y-2">
          <h4 className="text-sm">Calorías</h4>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={[
              filters.nutritional.minCalories,
              filters.nutritional.maxCalories,
            ]}
            onValueChange={values => {
              handleNutritionalChange("minCalories", [values[0]]);
              handleNutritionalChange("maxCalories", [values[1]]);
            }}
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{filters.nutritional.minCalories}kcal</span>
            <span>{filters.nutritional.maxCalories}kcal</span>
          </div>
        </div>

        {/* Proteínas */}
        <div className="space-y-2">
          <h4 className="text-sm">Proteínas</h4>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[
              filters.nutritional.minProtein,
              filters.nutritional.maxProtein,
            ]}
            onValueChange={values => {
              handleNutritionalChange("minProtein", [values[0]]);
              handleNutritionalChange("maxProtein", [values[1]]);
            }}
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{filters.nutritional.minProtein}g</span>
            <span>{filters.nutritional.maxProtein}g</span>
          </div>
        </div>

        {/* Carbohidratos */}
        <div className="space-y-2">
          <h4 className="text-sm">Carbohidratos</h4>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[filters.nutritional.minCarbs, filters.nutritional.maxCarbs]}
            onValueChange={values => {
              handleNutritionalChange("minCarbs", [values[0]]);
              handleNutritionalChange("maxCarbs", [values[1]]);
            }}
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{filters.nutritional.minCarbs}g</span>
            <span>{filters.nutritional.maxCarbs}g</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Container>
      <div className="flex flex-col space-y-6 py-8 md:flex-row md:space-x-8 md:space-y-0">
        {/* Filtros para pantallas grandes */}
        <aside className="hidden w-64 md:block">
          <div className="sticky top-8 space-y-6">{renderFilters()}</div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1">
          {/* Filtros móviles */}
          <div className="mb-6 md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  Filtros
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Filtros</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">{renderFilters()}</div>
                  <DrawerFooter>
                    <Button
                      onClick={() => {
                        // Restablecer filtros
                        setFilters({
                          search: "",
                          category: "all",
                          minPrice: 0,
                          maxPrice: 10000,
                          isGlutenFree: false,
                          isDairyFree: false,
                          isVegan: false,
                          nutritional: {
                            minCalories: 0,
                            maxCalories: 1000,
                            minProtein: 0,
                            maxProtein: 100,
                            minCarbs: 0,
                            maxCarbs: 100,
                          },
                        });
                      }}
                      variant="outline"
                    >
                      Restablecer filtros
                    </Button>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product.id)}
                  />
                ))}
          </div>

          {/* Mensaje de no resultados */}
          {!loading && products.length === 0 && (
            <div className="text-center">
              <p className="text-gray-500">
                No se encontraron productos que coincidan con los filtros
                seleccionados.
              </p>
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}
