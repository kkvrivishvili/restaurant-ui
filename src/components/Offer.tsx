import Image from "next/image";
import React from "react";
import CountDown from "./CountDown";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const Offer = () => {
  return (
    <section className="relative bg-black py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 hidden md:block">
        <Image 
          src="/offerBg.png" 
          alt="Background" 
          fill 
          className="object-cover opacity-50"
          priority
        />
      </div>
      <Container className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* TEXT CONTAINER */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Deliciosa hamburguesa
            </h2>
            <p className="text-lg text-white/90">
              Doble carne, cheddar, tomatitos y salsa americana.
            </p>
            <div className="w-full max-w-md">
              <CountDown targetDate="2024-12-31" />
            </div>
            <Button size="lg" className="w-full md:w-auto">
              Pedir ahora
            </Button>
          </div>
          {/* IMAGE CONTAINER */}
          <div className="relative aspect-square md:aspect-[4/3]">
            <Image 
              src="/offerProduct.png" 
              alt="Hamburguesa especial" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Offer;
