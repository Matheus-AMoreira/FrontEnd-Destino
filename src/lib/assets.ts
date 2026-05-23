// Import images
import destaque from "./assets/images/destaque.png";
import logo from "./assets/images/logo.png";
import logo_cor from "./assets/images/logo_cor.png";
import placeholder from "./assets/images/placeholder.jpg";

// Import icons
import favicon from "./assets/icons/favicon.svg";
import facebook from "./assets/icons/facebook.svg";
import instagram from "./assets/icons/instagram.svg";
import facebook_white from "./assets/icons/facebook_white.svg";
import instagram_white from "./assets/icons/instagram_white.svg";

export const IMAGES: Record<string, string> = {
  LOGO: logo,
  LOGO_COR: logo_cor,
  PLACEHOLDER: placeholder,
  DESTAQUE: destaque,
};

export const ICONS: Record<string, string> = {
  FACEBOOK: facebook,
  INSTAGRAM: instagram,
  FACEBOOK_WHITE: facebook_white,
  INSTAGRAM_WHITE: instagram_white,
  FAVICON: favicon,
};

export function getImageUrl(name: string): string {
  if (name.startsWith("http") || name.startsWith("/") || name.includes(".")) {
    return name;
  }
  return IMAGES[name.toUpperCase()] || IMAGES.PLACEHOLDER;
}

export function getIconUrl(name: string): string {
  return ICONS[name.toUpperCase()] || "";
}
