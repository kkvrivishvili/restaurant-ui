/**
 * Datos estáticos de la aplicación
 *
 * Productos:
 * - id: Identificador único
 * - title: Nombre del producto
 * - desc: Descripción
 * - img: Ruta de la imagen
 * - price: Precio en centavos
 * - nutritionalInfo: Información nutricional
 * - preparationInfo: Información de preparación
 * - storageInfo: Información de almacenamiento
 * - dietaryInfo: Información dietética
 * - category: Categoría del producto
 * - tags: Etiquetas del producto
 * - rating: Calificación promedio
 * - reviews: Número de reseñas
 * - discount: Descuento (opcional)
 * - stock: Cantidad en stock
 * - isActive: Estado de activación del producto
 *
 * Categorías disponibles:
 * - protein
 * - lowCarb
 * - vegan
 * - vegetarian
 *
 * Uso:
 * ```ts
 * import { products } from '@/data'
 *
 * // Filtrar por categoría
 * const proteinProducts = products.filter(p => p.category === 'protein')
 *
 * // Obtener productos con descuento
 * const discountedProducts = products.filter(p => p.discount !== undefined)
 * ```
 *
 * Notas:
 * - Las imágenes deben estar en /public/images
 * - Los precios están en centavos (2500 = $25.00)
 * - Las categorías deben coincidir con APP_CONSTANTS
 */

// Constantes de la aplicación
export const APP_CONSTANTS = {
  SHIPPING_COST: 999,
  FREE_SHIPPING_THRESHOLD: 14999,
  MIN_ORDER_AMOUNT: 4999,
  MAX_ITEMS_PER_ORDER: 20,
  DIETARY_TAGS: {
    GLUTEN_FREE: "gluten-free",
    DAIRY_FREE: "dairy-free",
    SOY_FREE: "soy-free",
    NUT_FREE: "nut-free",
    VEGAN: "vegan",
    VEGETARIAN: "vegetarian",
  },
  MEAL_TAGS: {
    NEW_ARRIVAL: "new-arrival",
    FEATURED: "featured",
    SEASONAL: "seasonal",
    BESTSELLER: "bestseller",
    PROMOTION: "promotion",
    POPULAR: "popular",
  },
  SIDE_DISHES: {
    ROASTED_VEGETABLES: "roasted-vegetables",
    MASHED_POTATOES: "mashed-potatoes",
    QUINOA: "quinoa",
    RICE: "rice",
  },
} as const;

export type MealTag =
  (typeof APP_CONSTANTS.MEAL_TAGS)[keyof typeof APP_CONSTANTS.MEAL_TAGS];
export type DietaryTag =
  (typeof APP_CONSTANTS.DIETARY_TAGS)[keyof typeof APP_CONSTANTS.DIETARY_TAGS];
export type SideDish =
  (typeof APP_CONSTANTS.SIDE_DISHES)[keyof typeof APP_CONSTANTS.SIDE_DISHES];

// Tipos base
type DietaryInfo = {
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isSoyFree: boolean;
  isNutFree: boolean;
  isVegan: boolean;
};

type NutritionalInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type PreparationInfo = {
  heatingTime: number; // Tiempo en minutos en baño maría
  servingSize: string; // Tamaño de la porción
  servings: number; // Número de porciones
  sideDish?: SideDish; // Guarnición opcional
};

type StorageInfo = {
  shelfLife: number;
  instructions: string;
};

type CategoryId = "protein" | "lowCarb" | "vegan" | "vegetarian";

interface Product {
  id: number;
  title: string;
  desc: string;
  img: string;
  price: number;
  nutritionalInfo: NutritionalInfo;
  preparationInfo: PreparationInfo;
  storageInfo: StorageInfo;
  dietaryInfo: DietaryInfo;
  category: CategoryId;
  tags: MealTag[];
  rating: number;
  reviews: number;
  discount?: number;
  stock: number;
  isActive: boolean;
}

// Export type definitions
export type {
  Product,
  DietaryInfo,
  NutritionalInfo,
  PreparationInfo,
  StorageInfo,
  CategoryId
};

// Definición de categorías
export const categories: Record<
  CategoryId,
  {
    title: string;
    desc: string;
    img?: string;
    color: string;
    icon: string;
  }
> = {
  protein: {
    title: "Alto en Proteína",
    desc: "Platos ricos en proteína para tu desarrollo muscular",
    color: "bg-red-500",
    icon: "dumbbell",
    img: "/temporary/m1.png",
  },
  vegetarian: {
    title: "Vegetariano",
    desc: "Deliciosas opciones vegetarianas",
    color: "bg-green-500",
    icon: "leaf",
    img: "/temporary/m2.png",
  },
  vegan: {
    title: "Vegano",
    desc: "100% libre de productos animales",
    color: "bg-emerald-500",
    icon: "sprout",
    img: "/temporary/m3.png",
  },
  lowCarb: {
    title: "Bajo en Carbohidratos",
    desc: "Ideal para dietas bajas en carbohidratos",
    color: "bg-purple-500",
    icon: "wheat-off",
    img: "/temporary/m4.png",
  },
};

// Productos ejemplo
export const products: Product[] = [
  {
    id: 1,
    title: "Pollo al Limón con Quinoa",
    desc: "Pechuga de pollo jugosa marinada en limón, acompañada de quinoa y vegetales al vapor",
    img: "/temporary/p1.png",
    price: 2500,
    nutritionalInfo: {
      calories: 450,
      protein: 35,
      carbs: 30,
      fat: 15,
      fiber: 5,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "400g",
      servings: 1,
      sideDish: APP_CONSTANTS.SIDE_DISHES.ROASTED_VEGETABLES,
    },
    storageInfo: {
      shelfLife: 5,
      instructions: "Mantener refrigerado entre 0°C y 5°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "protein",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.POPULAR,
    ],
    rating: 4.8,
    reviews: 256,
    discount: 10,
    stock: 15,
    isActive: true,
  },
  {
    id: 2,
    title: "Bowl Vegetariano de Lentejas",
    desc: "Bowl nutritivo de lentejas, arroz integral, vegetales asados y hummus casero",
    img: "/temporary/p2.png",
    price: 2299,
    nutritionalInfo: {
      calories: 380,
      protein: 18,
      carbs: 52,
      fat: 14,
      fiber: 12,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "350g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 10,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "vegetarian",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.PROMOTION,
    ],
    rating: 4.6,
    reviews: 89,
    stock: 8,
    isActive: true,
  },
  {
    id: 3,
    title: "Salmón Teriyaki con Arroz Integral",
    desc: "Filete de salmón glaseado con salsa teriyaki casera y arroz integral con vegetales",
    img: "/temporary/p3.png",
    price: 2899,
    nutritionalInfo: {
      calories: 460,
      protein: 32,
      carbs: 48,
      fat: 18,
      fiber: 4,
    },
    preparationInfo: {
      heatingTime: 4,
      servingSize: "380g",
      servings: 1,
      sideDish: APP_CONSTANTS.SIDE_DISHES.MASHED_POTATOES,
    },
    storageInfo: {
      shelfLife: 7,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: false,
      isNutFree: true,
      isVegan: false,
    },
    category: "protein",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.BESTSELLER,
    ],
    rating: 4.9,
    reviews: 124,
    stock: 12,
    isActive: true,
  },
  {
    id: 4,
    title: "Bowl Vegano de Quinoa y Garbanzos",
    desc: "Bowl proteico vegano con quinoa, garbanzos especiados, aguacate y vegetales asados",
    img: "/temporary/p4.png",
    price: 2399,
    nutritionalInfo: {
      calories: 340,
      protein: 16,
      carbs: 48,
      fat: 12,
      fiber: 14,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "400g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 10,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: true,
    },
    category: "vegan",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
    ],
    rating: 4.7,
    reviews: 92,
    stock: 5,
    isActive: true,
  },
  {
    id: 5,
    title: "Pavo al Romero con Puré de Coliflor",
    desc: "Pechuga de pavo marinada con romero y puré cremoso de coliflor bajo en carbohidratos",
    img: "/temporary/p5.png",
    price: 2599,
    nutritionalInfo: {
      calories: 320,
      protein: 38,
      carbs: 12,
      fat: 16,
      fiber: 6,
    },
    preparationInfo: {
      heatingTime: 4,
      servingSize: "350g",
      servings: 1,
      sideDish: APP_CONSTANTS.SIDE_DISHES.ROASTED_VEGETABLES,
    },
    storageInfo: {
      shelfLife: 12,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: false,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "lowCarb",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.SEASONAL,
    ],
    rating: 4.5,
    reviews: 78,
    stock: 18,
    isActive: true,
  },
  {
    id: 6,
    title: "Curry Vegetariano de Garbanzos",
    desc: "Curry aromático de garbanzos con espinacas y arroz basmati integral",
    img: "/temporary/p6.png",
    price: 2199,
    nutritionalInfo: {
      calories: 410,
      protein: 14,
      carbs: 62,
      fat: 16,
      fiber: 12,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "400g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 10,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "vegetarian",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
    ],
    rating: 4.4,
    reviews: 45,
    stock: 7,
    isActive: true,
  },
  {
    id: 7,
    title: "Pollo BBQ Familiar",
    desc: "Muslos de pollo en salsa BBQ casera con puré de papas y vegetales asados",
    img: "/temporary/p7.png",
    price: 3999,
    nutritionalInfo: {
      calories: 520,
      protein: 42,
      carbs: 48,
      fat: 22,
      fiber: 5,
    },
    preparationInfo: {
      heatingTime: 5,
      servingSize: "800g",
      servings: 4,
      sideDish: APP_CONSTANTS.SIDE_DISHES.MASHED_POTATOES,
    },
    storageInfo: {
      shelfLife: 14,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: false,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "protein",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.8,
    reviews: 167,
    discount: 10,
    stock: 16,
    isActive: true,
  },
  {
    id: 8,
    title: "Bowl Proteico Vegano",
    desc: "Bowl con tempeh marinado, quinoa, brócoli, garbanzos y salsa tahini",
    img: "/temporary/p8.png",
    price: 2499,
    nutritionalInfo: {
      calories: 380,
      protein: 24,
      carbs: 42,
      fat: 16,
      fiber: 12,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "400g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 10,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: false,
      isNutFree: false,
      isVegan: true,
    },
    category: "vegan",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
    ],
    rating: 4.6,
    reviews: 34,
    stock: 9,
    isActive: true,
  },
  {
    id: 9,
    title: "Atún a la Plancha Keto",
    desc: "Filete de atún a la plancha con espárragos y mayonesa de wasabi",
    img: "/temporary/p9.png",
    price: 2799,
    nutritionalInfo: {
      calories: 340,
      protein: 42,
      carbs: 8,
      fat: 18,
      fiber: 4,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "350g",
      servings: 1,
      sideDish: APP_CONSTANTS.SIDE_DISHES.ROASTED_VEGETABLES,
    },
    storageInfo: {
      shelfLife: 7,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: false,
      isNutFree: true,
      isVegan: false,
    },
    category: "lowCarb",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.7,
    reviews: 89,
    stock: 11,
    isActive: true,
  },
  {
    id: 10,
    title: "Lasaña Vegetariana Familiar",
    desc: "Lasaña de vegetales asados, espinacas y ricotta con salsa de tomate casera",
    img: "/temporary/p10.png",
    price: 3699,
    nutritionalInfo: {
      calories: 460,
      protein: 22,
      carbs: 52,
      fat: 20,
      fiber: 8,
    },
    preparationInfo: {
      heatingTime: 5,
      servingSize: "750g",
      servings: 4,
    },
    storageInfo: {
      shelfLife: 14,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: false,
      isDairyFree: false,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "vegetarian",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.8,
    reviews: 145,
    discount: 15,
    stock: 14,
    isActive: true,
  },
  {
    id: 11,
    title: "Wrap de Pollo Sin Gluten",
    desc: "Wrap de pollo grillado con aguacate y vegetales en tortilla sin gluten",
    img: "/temporary/p11.png",
    price: 2199,
    nutritionalInfo: {
      calories: 380,
      protein: 28,
      carbs: 32,
      fat: 16,
      fiber: 8,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "300g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 7,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "protein",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.5,
    reviews: 67,
    stock: 6,
    isActive: true,
  },
  {
    id: 12,
    title: "Ratatouille Vegano",
    desc: "Ratatouille tradicional con vegetales de estación y arroz integral",
    img: "/temporary/p12.png",
    price: 2299,
    nutritionalInfo: {
      calories: 280,
      protein: 8,
      carbs: 48,
      fat: 10,
      fiber: 12,
    },
    preparationInfo: {
      heatingTime: 4,
      servingSize: "350g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 10,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: true,
    },
    category: "vegan",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
    ],
    rating: 4.4,
    reviews: 42,
    stock: 13,
    isActive: true,
  },
  {
    id: 13,
    title: "Milanesa de Pollo Familiar",
    desc: "Milanesas de pollo horneadas con puré de papas y ensalada",
    img: "/temporary/p13.png",
    price: 3899,
    nutritionalInfo: {
      calories: 480,
      protein: 38,
      carbs: 46,
      fat: 18,
      fiber: 4,
    },
    preparationInfo: {
      heatingTime: 5,
      servingSize: "800g",
      servings: 4,
      sideDish: APP_CONSTANTS.SIDE_DISHES.MASHED_POTATOES,
    },
    storageInfo: {
      shelfLife: 14,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: false,
      isDairyFree: false,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "protein",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.9,
    reviews: 189,
    discount: 12,
    stock: 19,
    isActive: true,
  },
  {
    id: 15,
    title: "Bowl Keto de Carne",
    desc: "Bowl bajo en carbohidratos con carne vacuna, aguacate y vegetales salteados",
    img: "/temporary/p15.png",
    price: 2699,
    nutritionalInfo: {
      calories: 420,
      protein: 32,
      carbs: 10,
      fat: 28,
      fiber: 6,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "340g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 10,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "lowCarb",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.7,
    reviews: 82,
    stock: 4,
    isActive: true,
  },
  {
    id: 16,
    title: "Ensalada Proteica de Atún",
    desc: "Ensalada completa con atún, huevo, quinoa y vegetales frescos",
    img: "/temporary/p16.png",
    price: 2299,
    nutritionalInfo: {
      calories: 350,
      protein: 28,
      carbs: 32,
      fat: 14,
      fiber: 8,
    },
    preparationInfo: {
      heatingTime: 0,
      servingSize: "400g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 5,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "protein",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.5,
    reviews: 64,
    stock: 17,
    isActive: true,
  },
  {
    id: 17,
    title: "Curry Verde Vegano Familiar",
    desc: "Curry tailandés con tofu, vegetales variados y arroz jazmín",
    img: "/temporary/p17.png",
    price: 3599,
    nutritionalInfo: {
      calories: 420,
      protein: 18,
      carbs: 58,
      fat: 16,
      fiber: 10,
    },
    preparationInfo: {
      heatingTime: 4,
      servingSize: "800g",
      servings: 4,
    },
    storageInfo: {
      shelfLife: 10,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: false,
      isNutFree: true,
      isVegan: true,
    },
    category: "vegan",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.6,
    reviews: 38,
    discount: 8,
    stock: 10,
    isActive: true,
  },
  {
    id: 18,
    title: "Pechuga Rellena Low Carb",
    desc: "Pechuga de pollo rellena de espinaca y queso con vegetales grillados",
    img: "/temporary/p18.png",
    price: 2799,
    nutritionalInfo: {
      calories: 380,
      protein: 45,
      carbs: 8,
      fat: 20,
      fiber: 4,
    },
    preparationInfo: {
      heatingTime: 4,
      servingSize: "360g",
      servings: 1,
      sideDish: APP_CONSTANTS.SIDE_DISHES.ROASTED_VEGETABLES,
    },
    storageInfo: {
      shelfLife: 10,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: false,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "lowCarb",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.8,
    reviews: 95,
    stock: 3,
    isActive: true,
  },
  {
    id: 19,
    title: "Risotto de Hongos Vegetariano",
    desc: "Risotto cremoso de hongos portobello y parmesano",
    img: "/temporary/p19.png",
    price: 2499,
    nutritionalInfo: {
      calories: 440,
      protein: 14,
      carbs: 65,
      fat: 16,
      fiber: 6,
    },
    preparationInfo: {
      heatingTime: 4,
      servingSize: "350g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 8,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: false,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "vegetarian",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
    ],
    rating: 4.7,
    reviews: 76,
    stock: 20,
    isActive: true,
  },
  {
    id: 20,
    title: "Tarta de Verduras Sin Gluten",
    desc: "Tarta de verduras de estación con masa sin gluten y queso",
    img: "/temporary/p20.png",
    price: 2399,
    nutritionalInfo: {
      calories: 320,
      protein: 16,
      carbs: 28,
      fat: 18,
      fiber: 8,
    },
    preparationInfo: {
      heatingTime: 4,
      servingSize: "300g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 7,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: false,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "lowCarb",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
    ],
    rating: 4.5,
    reviews: 42,
    stock: 2,
    isActive: true,
  },
  {
    id: 21,
    title: "Low Carb Bowl",
    desc: "Bowl bajo en carbohidratos con pollo a la parrilla, aguacate y vegetales frescos",
    img: "/images/low-carb-bowl.jpg",
    price: 1899,
    nutritionalInfo: {
      calories: 350,
      protein: 25,
      carbs: 8,
      fat: 28,
      fiber: 6,
    },
    preparationInfo: {
      heatingTime: 3,
      servingSize: "350g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 3,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
      isVegan: false,
    },
    category: "lowCarb",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.NEW_ARRIVAL,
      APP_CONSTANTS.MEAL_TAGS.FEATURED,
    ],
    rating: 4.5,
    reviews: 42,
    stock: 1,
    isActive: true,
  },
];
