/**
 * Slider: Componente de presentación principal para la página de inicio
 *
 * Características:
 * - Autoplay con transiciones suaves
 * - Indicadores de slide
 * - Botones de navegación
 * - Diseño responsive
 * - Optimización de imágenes
 */

"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const data = [
  {
    id: 1,
    title: "Comida Saludable",
    subtitle: "Preparada con ingredientes frescos",
    description: "Descubre nuestra selección de platos nutritivos y deliciosos",
    image: "/slide1.png",
    cta: "Ver Menú",
    link: "/menu",
  },
  {
    id: 2,
    title: "Delivery Express",
    subtitle: "En Ciudad de Mendoza",
    description: "Entrega rápida y segura a tu puerta",
    image: "/slide2.png",
    cta: "Ordenar Ahora",
    link: "/menu",
  },
  {
    id: 3,
    title: "Calidad Premium",
    subtitle: "Para toda la familia",
    description: "Platos preparados con los mejores ingredientes",
    image: "/slide3.jpg",
    cta: "Explorar",
    link: "/menu",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1)),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] overflow-hidden bg-background">
      {/* SLIDES */}
      <div
        className="h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {data.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute top-0 left-0 w-full h-full flex flex-col lg:flex-row"
            style={{ transform: `translateX(${index * 100}%)` }}
          >
            {/* TEXT CONTAINER */}
            <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
              <div className="max-w-2xl space-y-6">
                <h2 className="text-sm uppercase tracking-wider text-primary">
                  {slide.subtitle}
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                  {slide.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {slide.description}
                </p>
                <Button size="lg" className="rounded-full">
                  {slide.cta}
                </Button>
              </div>
            </div>

            {/* IMAGE CONTAINER */}
            <div className="flex-1 relative">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* NAVIGATION BUTTONS */}
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* INDICATORS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === index
                ? "bg-primary w-8"
                : "bg-muted hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
