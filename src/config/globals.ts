interface NavItem {
  title: string;
  href: string;
}

interface SiteLinks {
  phone: string;
  instagram: string;
  facebook: string;
}

interface SiteConfiguration {
  name: string;
  description: string;
  mainNav: NavItem[];
  links: SiteLinks;
}

export const siteConfig: SiteConfiguration = {
  name: "Vera",
  description: "Comida saludable a tu puerta",
  mainNav: [
    {
      title: "Inicio",
      href: "/",
    },
    {
      title: "Menu",
      href: "/menu",
    },
    {
      title: "Nosotros",
      href: "/about",
    },
    {
      title: "Contacto",
      href: "/contact",
    },
  ],
  links: {
    phone: "123 456 78",
    instagram: "https://instagram.com/vera",
    facebook: "https://facebook.com/vera",
  },
};

export type SiteConfig = typeof siteConfig;
