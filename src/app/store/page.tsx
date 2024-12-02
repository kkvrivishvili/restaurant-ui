"use client";

import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { products, APP_CONSTANTS, categories, Product } from "@/data";
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
} from "@/components/ui/card";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Plus,
  UtensilsCrossed,
  Soup,
  Pizza as PizzaIcon,
  Milk,
  Wheat,
  Nut,
  Sprout,
  Dumbbell,
  Leaf,
  Ban,
  Filter,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Tipos para los filtros
type Filters = {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isVegan: boolean;
  nutritional: {
    minCalories: number;
    maxCalories: number;
    minProtein: number;
    maxProtein: number;
    minCarbs: number;
    maxCarbs: number;
  };
};

// Tipos para los iconos
type CategoryIconProps = {
  category: string;
};

type DietaryIconProps = {
  tag: string;
};

// Tipo para la página
type PageProps = {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Componente para CategoryIcon
const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  switch (category) {
    case "protein":
      return <Dumbbell className="w-8 h-8" />;
    case "lowCarb":
      return <UtensilsCrossed className="w-8 h-8" />;
    case "vegan":
      return <Leaf className="w-8 h-8" />;
    case "vegetarian":
      return <Soup className="w-8 h-8" />;
    default:
      return null;
  }
};

// Componente para DietaryIcon
const DietaryIcon: React.FC<DietaryIconProps> = ({ tag }) => {
  switch (tag) {
    case "GLUTEN_FREE":
      return <Wheat className="w-5 h-5" />;
    case "DAIRY_FREE":
      return <Milk className="w-5 h-5" />;
    case "NUT_FREE":
      return <Nut className="w-5 h-5" />;
    case "SOY_FREE":
      return <Sprout className="w-5 h-5" />;
    default:
      return <Ban className="w-5 h-5" />;
  }
};

// Componente StorePage
export default function StorePage() {
  // Estados persistentes para los filtros
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    minPrice: 0,
    maxPrice: 5000,
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

  // Estados locales
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterBarPinned, setIsFilterBarPinned] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [categoryCount, setCategoryCount] = useState<Record<string, number>>(
    {}
  );

  const { addToCart } = useContext(CartContext)!;
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Efecto para simular carga inicial
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Efecto para calcular el número de filtros activos
  useEffect(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category && filters.category !== "all") count++;
    if (filters.isGlutenFree) count++;
    if (filters.isDairyFree) count++;
    if (filters.isVegan) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 5000) count++;
    if (filters.nutritional.minCalories > 0 || filters.nutritional.maxCalories < 1000) count++;
    if (filters.nutritional.minProtein > 0 || filters.nutritional.maxProtein < 100) count++;
    if (filters.nutritional.minCarbs > 0 || filters.nutritional.maxCarbs < 100) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Efecto para calcular el conteo de productos por categoría
  useEffect(() => {
    const counts: Record<string, number> = {};
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    setCategoryCount(counts);
  }, []);

  // Función para filtrar productos
  const filterProducts = useCallback((product: Product) => {
    // Search filter
    if (
      filters.search &&
      !product.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !product.desc.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (filters.category !== "all" && product.category !== filters.category) {
      return false;
    }

    // Price filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    // Dietary preferences
    if (filters.isGlutenFree && !product.dietaryInfo.isGlutenFree) {
      return false;
    }
    if (filters.isDairyFree && !product.dietaryInfo.isDairyFree) {
      return false;
    }
    if (filters.isVegan && !product.dietaryInfo.isVegan) {
      return false;
    }

    // Nutritional filters
    const nutrition = product.nutritionalInfo;
    if (
      nutrition.calories < filters.nutritional.minCalories ||
      nutrition.calories > filters.nutritional.maxCalories ||
      nutrition.protein < filters.nutritional.minProtein ||
      nutrition.protein > filters.nutritional.maxProtein ||
      nutrition.carbs < filters.nutritional.minCarbs ||
      nutrition.carbs > filters.nutritional.maxCarbs
    ) {
      return false;
    }

    return true;
  }, [filters]);

  // Efecto para aplicar los filtros
  useEffect(() => {
    const filtered = products.filter(filterProducts);
    setFilteredProducts(filtered);
  }, [filters, filterProducts]);

  // Renderizado del filtro móvil
  const renderMobileFilter = () => (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg md:hidden"
        onClick={() => setIsDrawerOpen(true)}
      >
        <Filter className="h-6 w-6" />
        {activeFiltersCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
          </DrawerHeader>
          {renderFilters()}
          <DrawerFooter>
            <Button onClick={() => setIsDrawerOpen(false)}>
              Aplicar Filtros
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );

  // Renderizado de los filtros
  const renderFilters = () => (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Búsqueda</label>
        <Input
          placeholder="Buscar productos..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Categoría</label>
        <Select
          defaultValue="all"
          value={filters.category}
          onValueChange={(value: string) =>
            setFilters({ ...filters, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue>
              {filters.category === "all"
                ? "Todas las categorías"
                : categories[filters.category as keyof typeof categories]
                    ?.title}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {Object.entries(categories).map(([id, category]) => (
              <SelectItem key={id} value={id}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rango de Precio</label>
        <div className="pt-2">
          <Slider
            defaultValue={[filters.minPrice, filters.maxPrice]}
            max={5000}
            step={100}
            onValueChange={([min, max]) =>
              setFilters({ ...filters, minPrice: min, maxPrice: max })
            }
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-muted-foreground">
              ${filters.minPrice}
            </span>
            <span className="text-sm text-muted-foreground">
              ${filters.maxPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Preferencias Dietéticas</label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">Sin Gluten</label>
            <Switch
              checked={filters.isGlutenFree}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, isGlutenFree: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Sin Lácteos</label>
            <Switch
              checked={filters.isDairyFree}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, isDairyFree: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Vegano</label>
            <Switch
              checked={filters.isVegan}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, isVegan: checked })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Información Nutricional</label>
        <div className="space-y-2">
          <div className="space-y-2">
            <label className="text-sm">Calorías</label>
            <div className="pt-2">
              <Slider
                defaultValue={[
                  filters.nutritional.minCalories,
                  filters.nutritional.maxCalories,
                ]}
                max={1000}
                step={50}
                onValueChange={([min, max]) =>
                  setFilters({
                    ...filters,
                    nutritional: {
                      ...filters.nutritional,
                      minCalories: min,
                      maxCalories: max,
                    },
                  })
                }
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">
                  {filters.nutritional.minCalories} kcal
                </span>
                <span className="text-sm text-muted-foreground">
                  {filters.nutritional.maxCalories} kcal
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Proteínas</label>
            <div className="pt-2">
              <Slider
                defaultValue={[
                  filters.nutritional.minProtein,
                  filters.nutritional.maxProtein,
                ]}
                max={100}
                step={5}
                onValueChange={([min, max]) =>
                  setFilters({
                    ...filters,
                    nutritional: {
                      ...filters.nutritional,
                      minProtein: min,
                      maxProtein: max,
                    },
                  })
                }
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">
                  {filters.nutritional.minProtein}g
                </span>
                <span className="text-sm text-muted-foreground">
                  {filters.nutritional.maxProtein}g
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Carbohidratos</label>
            <div className="pt-2">
              <Slider
                defaultValue={[
                  filters.nutritional.minCarbs,
                  filters.nutritional.maxCarbs,
                ]}
                max={100}
                step={5}
                onValueChange={([min, max]) =>
                  setFilters({
                    ...filters,
                    nutritional: {
                      ...filters.nutritional,
                      minCarbs: min,
                      maxCarbs: max,
                    },
                  })
                }
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">
                  {filters.nutritional.minCarbs}g
                </span>
                <span className="text-sm text-muted-foreground">
                  {filters.nutritional.maxCarbs}g
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizado principal
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pb-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
    toast({
      title: "Producto agregado",
      description: product.title,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center">Tienda</h1>
      </div>

      {/* Main content container */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-64 space-y-6">
          {/* Category Filter */}
          <Card className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium">Categoría</h3>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {filters.category === "all"
                      ? "Todas las categorías"
                      : categories[
                          filters.category as keyof typeof categories
                        ].title}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {Object.entries(categories).map(([id, category]) => (
                    <SelectItem key={id} value={id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Price Range Filter */}
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Rango de Precio</h3>
              <div className="pt-2">
                <Slider
                  defaultValue={[filters.minPrice, filters.maxPrice]}
                  max={5000}
                  step={100}
                  onValueChange={([min, max]) =>
                    setFilters({ ...filters, minPrice: min, maxPrice: max })
                  }
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-muted-foreground">
                    ${filters.minPrice}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ${filters.maxPrice}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Dietary Preferences */}
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Preferencias Dietéticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Sin Gluten</label>
                  <Switch
                    checked={filters.isGlutenFree}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, isGlutenFree: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Sin Lácteos</label>
                  <Switch
                    checked={filters.isDairyFree}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, isDairyFree: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Vegano</label>
                  <Switch
                    checked={filters.isVegan}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, isVegan: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Nutritional Filters */}
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Información Nutricional</h3>
              {/* Calories */}
              <div className="space-y-2">
                <label className="text-sm">Calorías</label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[
                      filters.nutritional.minCalories,
                      filters.nutritional.maxCalories,
                    ]}
                    max={1000}
                    step={50}
                    onValueChange={([min, max]) =>
                      setFilters({
                        ...filters,
                        nutritional: {
                          ...filters.nutritional,
                          minCalories: min,
                          maxCalories: max,
                        },
                      })
                    }
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      {filters.nutritional.minCalories} kcal
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {filters.nutritional.maxCalories} kcal
                    </span>
                  </div>
                </div>
              </div>

              {/* Protein */}
              <div className="space-y-2">
                <label className="text-sm">Proteínas</label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[
                      filters.nutritional.minProtein,
                      filters.nutritional.maxProtein,
                    ]}
                    max={100}
                    step={5}
                    onValueChange={([min, max]) =>
                      setFilters({
                        ...filters,
                        nutritional: {
                          ...filters.nutritional,
                          minProtein: min,
                          maxProtein: max,
                        },
                      })
                    }
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      {filters.nutritional.minProtein}g
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {filters.nutritional.maxProtein}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Carbs */}
              <div className="space-y-2">
                <label className="text-sm">Carbohidratos</label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[
                      filters.nutritional.minCarbs,
                      filters.nutritional.maxCarbs,
                    ]}
                    max={100}
                    step={5}
                    onValueChange={([min, max]) =>
                      setFilters({
                        ...filters,
                        nutritional: {
                          ...filters.nutritional,
                          minCarbs: min,
                          maxCarbs: max,
                        },
                      })
                    }
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      {filters.nutritional.minCarbs}g
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {filters.nutritional.maxCarbs}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="pl-10"
            />
          </div>

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} productos encontrados
            </p>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
                onClick={() => {
                  // Navigate to product detail page
                  window.location.href = `/product/${product.id}`;
                }}
              >
                <CardHeader className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={product.img}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.desc}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {product.rating} ({product.reviews} reseñas)
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-lg font-bold">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking button
                        handleAddToCart(product);
                      }}
                      disabled={!product.isActive || product.stock === 0}
                    >
                      Agregar al carrito
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
