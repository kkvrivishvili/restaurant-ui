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
    GLUTEN_FREE: "GLUTEN_FREE",
    DAIRY_FREE: "DAIRY_FREE",
    SOY_FREE: "SOY_FREE",
    NUT_FREE: "NUT_FREE",
  },
  MEAL_TAGS: {
    POPULAR: "POPULAR",
    NEW: "NEW",
    PROMOTION: "PROMOTION",
    ATHLETE: "ATHLETE",
    WEIGHT_LOSS: "WEIGHT_LOSS",
    FAMILY_SIZE: "FAMILY_SIZE",
    OFFICE: "OFFICE",
    BESTSELLER: "BESTSELLER",
  },
  CATEGORIES: {
    PROTEIN: {
      id: "protein",
      title: "Alto en Proteína",
      color: "bg-blue-500",
    },
    LOW_CARB: {
      id: "lowCarb",
      title: "Bajo en Carbohidratos",
      color: "bg-green-500",
    },
    VEGAN: {
      id: "vegan",
      title: "Vegano",
      color: "bg-emerald-500",
    },
    VEGETARIAN: {
      id: "vegetarian",
      title: "Vegetariano",
      color: "bg-lime-500",
    },
  },
} as const;

export type MealTag =
  (typeof APP_CONSTANTS.MEAL_TAGS)[keyof typeof APP_CONSTANTS.MEAL_TAGS];
export type DietaryTag =
  (typeof APP_CONSTANTS.DIETARY_TAGS)[keyof typeof APP_CONSTANTS.DIETARY_TAGS];

// Tipos base
type DietaryInfo = {
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isSoyFree: boolean;
  isNutFree: boolean;
};

type NutritionalInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type PreparationInfo = {
  heatingTime: number;
  servingSize: string;
  servings: number;
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
}

interface MealPlan {
  id: number;
  name: string;
  description: string;
  duration: number; // días
  mealsPerDay: number;
  basePrice: number;
  discount: number;
  targetAudience: string;
  includes: string[];
  nutritionalTarget: {
    minProtein: number;
    maxCalories: number;
  };
  tags: MealTag[];
}

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

// Planes predefinidos
export const mealPlans: MealPlan[] = [
  {
    id: 1,
    name: "Plan Deportista",
    description:
      "Ideal para deportistas y personas activas que buscan mantener una dieta alta en proteínas",
    duration: 7,
    mealsPerDay: 2,
    basePrice: 14999,
    discount: 10,
    targetAudience: "Deportistas y personas activas",
    includes: [
      "14 comidas balanceadas",
      "Alto contenido proteico",
      "Variedad de proteínas magras",
      "Guía de nutrición deportiva",
    ],
    nutritionalTarget: {
      minProtein: 30,
      maxCalories: 600,
    },
    tags: [APP_CONSTANTS.MEAL_TAGS.ATHLETE, APP_CONSTANTS.MEAL_TAGS.POPULAR],
  },
  {
    id: 2,
    name: "Plan Office",
    description:
      "Perfecto para profesionales ocupados que buscan una alimentación saludable y conveniente",
    duration: 5,
    mealsPerDay: 1,
    basePrice: 9999,
    discount: 5,
    targetAudience: "Profesionales ocupados",
    includes: [
      "5 almuerzos balanceados",
      "Fácil preparación",
      "Contenedores aptos microondas",
      "Guía de snacks saludables",
    ],
    nutritionalTarget: {
      minProtein: 25,
      maxCalories: 500,
    },
    tags: [APP_CONSTANTS.MEAL_TAGS.OFFICE, APP_CONSTANTS.MEAL_TAGS.POPULAR],
  },
  {
    id: 3,
    name: "Plan Familia",
    description:
      "Porciones familiares para compartir, con opciones que gustan a todos",
    duration: 7,
    mealsPerDay: 1,
    basePrice: 19999,
    discount: 15,
    targetAudience: "Familias",
    includes: [
      "7 comidas familiares",
      "Porciones para 4 personas",
      "Recetas tradicionales",
      "Guía de complementos",
    ],
    nutritionalTarget: {
      minProtein: 25,
      maxCalories: 550,
    },
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FAMILY_SIZE,
      APP_CONSTANTS.MEAL_TAGS.BESTSELLER,
    ],
  },
];

// Productos ejemplo
export const products: Product[] = [
  {
    id: 1,
    title: "Pollo al Limón con Quinoa",
    desc: "Pechuga de pollo jugosa marinada en limón, acompañada de quinoa y vegetales al vapor",
    img: "/temporary/p1.png",
    price: 2499,
    nutritionalInfo: {
      calories: 420,
      protein: 35,
      carbs: 45,
      fat: 12,
      fiber: 6,
    },
    preparationInfo: {
      heatingTime: 12,
      servingSize: "350g",
      servings: 1,
    },
    storageInfo: {
      shelfLife: 14,
      instructions: "Mantener refrigerado entre 0°C y 4°C",
    },
    dietaryInfo: {
      isGlutenFree: true,
      isDairyFree: true,
      isSoyFree: true,
      isNutFree: true,
    },
    category: "protein",
    tags: [APP_CONSTANTS.MEAL_TAGS.POPULAR, APP_CONSTANTS.MEAL_TAGS.ATHLETE],
    rating: 4.8,
    reviews: 124,
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
      heatingTime: 10,
      servingSize: "330g",
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
    },
    category: "vegetarian",
    tags: [APP_CONSTANTS.MEAL_TAGS.WEIGHT_LOSS, APP_CONSTANTS.MEAL_TAGS.OFFICE],
    rating: 4.6,
    reviews: 89,
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
      heatingTime: 8,
      servingSize: "380g",
      servings: 1,
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
    },
    category: "protein",
    tags: [APP_CONSTANTS.MEAL_TAGS.BESTSELLER, APP_CONSTANTS.MEAL_TAGS.OFFICE],
    rating: 4.9,
    reviews: 156,
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
      heatingTime: 6,
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
    },
    category: "vegan",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.WEIGHT_LOSS,
      APP_CONSTANTS.MEAL_TAGS.POPULAR,
    ],
    rating: 4.7,
    reviews: 92,
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
      heatingTime: 10,
      servingSize: "360g",
      servings: 1,
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
    },
    category: "lowCarb",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.ATHLETE,
      APP_CONSTANTS.MEAL_TAGS.WEIGHT_LOSS,
    ],
    rating: 4.5,
    reviews: 78,
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
      heatingTime: 8,
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
    },
    category: "vegetarian",
    tags: [APP_CONSTANTS.MEAL_TAGS.NEW, APP_CONSTANTS.MEAL_TAGS.OFFICE],
    rating: 4.4,
    reviews: 45,
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
      heatingTime: 15,
      servingSize: "800g",
      servings: 4,
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
    },
    category: "protein",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FAMILY_SIZE,
      APP_CONSTANTS.MEAL_TAGS.BESTSELLER,
    ],
    rating: 4.8,
    reviews: 167,
    discount: 10,
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
      heatingTime: 7,
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
      isSoyFree: false,
      isNutFree: false,
    },
    category: "vegan",
    tags: [APP_CONSTANTS.MEAL_TAGS.ATHLETE, APP_CONSTANTS.MEAL_TAGS.NEW],
    rating: 4.6,
    reviews: 34,
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
      heatingTime: 6,
      servingSize: "320g",
      servings: 1,
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
    },
    category: "lowCarb",
    tags: [APP_CONSTANTS.MEAL_TAGS.ATHLETE, APP_CONSTANTS.MEAL_TAGS.POPULAR],
    rating: 4.7,
    reviews: 89,
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
      heatingTime: 20,
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
    },
    category: "vegetarian",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FAMILY_SIZE,
      APP_CONSTANTS.MEAL_TAGS.BESTSELLER,
    ],
    rating: 4.8,
    reviews: 145,
    discount: 15,
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
      heatingTime: 5,
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
    },
    category: "protein",
    tags: [APP_CONSTANTS.MEAL_TAGS.OFFICE, APP_CONSTANTS.MEAL_TAGS.POPULAR],
    rating: 4.5,
    reviews: 67,
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
      heatingTime: 8,
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
    },
    category: "vegan",
    tags: [APP_CONSTANTS.MEAL_TAGS.WEIGHT_LOSS, APP_CONSTANTS.MEAL_TAGS.NEW],
    rating: 4.4,
    reviews: 42,
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
      heatingTime: 15,
      servingSize: "800g",
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
    },
    category: "protein",
    tags: [
      APP_CONSTANTS.MEAL_TAGS.FAMILY_SIZE,
      APP_CONSTANTS.MEAL_TAGS.BESTSELLER,
    ],
    rating: 4.9,
    reviews: 189,
    discount: 12,
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
      heatingTime: 8,
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
    },
    category: "lowCarb",
    tags: [APP_CONSTANTS.MEAL_TAGS.ATHLETE, APP_CONSTANTS.MEAL_TAGS.POPULAR],
    rating: 4.7,
    reviews: 82,
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
      servingSize: "320g",
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
    },
    category: "protein",
    tags: [APP_CONSTANTS.MEAL_TAGS.OFFICE, APP_CONSTANTS.MEAL_TAGS.WEIGHT_LOSS],
    rating: 4.5,
    reviews: 64,
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
      heatingTime: 12,
      servingSize: "750g",
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
    },
    category: "vegan",
    tags: [APP_CONSTANTS.MEAL_TAGS.FAMILY_SIZE, APP_CONSTANTS.MEAL_TAGS.NEW],
    rating: 4.6,
    reviews: 38,
    discount: 8,
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
      heatingTime: 10,
      servingSize: "360g",
      servings: 1,
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
    },
    category: "lowCarb",
    tags: [APP_CONSTANTS.MEAL_TAGS.ATHLETE, APP_CONSTANTS.MEAL_TAGS.BESTSELLER],
    rating: 4.8,
    reviews: 95,
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
      heatingTime: 8,
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
    },
    category: "vegetarian",
    tags: [APP_CONSTANTS.MEAL_TAGS.POPULAR, APP_CONSTANTS.MEAL_TAGS.OFFICE],
    rating: 4.7,
    reviews: 76,
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
      heatingTime: 12,
      servingSize: "330g",
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
    },
    category: "lowCarb",
    tags: [APP_CONSTANTS.MEAL_TAGS.NEW, APP_CONSTANTS.MEAL_TAGS.OFFICE],
    rating: 4.5,
    reviews: 42,
  },
  {
    id: 42,
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
      heatingTime: 2,
      servingSize: "320g",
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
    },
    category: "lowCarb",
    tags: [APP_CONSTANTS.MEAL_TAGS.NEW, APP_CONSTANTS.MEAL_TAGS.OFFICE],
    rating: 4.5,
    reviews: 42,
  },
];
