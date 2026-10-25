import { brand } from "../content";

export const whatsappLink = (message: string = brand.whatsappMessage) =>
  `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const instagramLink = () => `https://instagram.com/${brand.instagramUser}`;

const mapsQuery = () => encodeURIComponent(brand.mapsQuery);

export const mapsLink = () => `https://www.google.com/maps/search/?api=1&query=${mapsQuery()}`;

export const mapsDirectionsLink = () => `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery()}`;

export const mapsEmbedLink = () => `https://www.google.com/maps?q=${mapsQuery()}&output=embed`;
