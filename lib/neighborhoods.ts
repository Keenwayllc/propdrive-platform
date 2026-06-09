/**
 * Los Angeles County neighborhoods used across the marketing site.
 * Images are royalty-free (Unsplash) and verified reachable.
 */
export interface Neighborhood {
  name: string;
  slug: string;
  image: string;
  blurb: string;
}

function img(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
}

export const NEIGHBORHOODS: ReadonlyArray<Neighborhood> = [
  { name: "Beverly Hills", slug: "beverly-hills", image: img("1580587771525-78b9dba3b914"), blurb: "Iconic estates, the flats, and the world-famous 90210 address." },
  { name: "Bel Air", slug: "bel-air", image: img("1600596542815-ffad4c1539a9"), blurb: "Gated privacy and trophy homes above the city." },
  { name: "Santa Monica", slug: "santa-monica", image: img("1507525428034-b723cf961d3e"), blurb: "Beach-close living, walkable, and bright year-round." },
  { name: "Malibu", slug: "malibu", image: img("1512917774080-9991f1c4c750"), blurb: "Twenty-seven miles of coastline, canyons, and ocean views." },
  { name: "Westwood", slug: "westwood", image: img("1486406146926-c627a92ad1ab"), blurb: "Village energy next to UCLA and the Wilshire corridor." },
  { name: "Pacific Palisades", slug: "pacific-palisades", image: img("1564013799919-ab600027ffc6"), blurb: "Village charm, ocean bluffs, and deep family roots." },
  { name: "Calabasas", slug: "calabasas", image: img("1568605114967-8130f3a36994"), blurb: "Hidden Hills luxury and gated valley estates." },
  { name: "Brentwood", slug: "brentwood", image: img("1570129477492-45c003edd2be"), blurb: "Quiet, leafy, and effortlessly upscale." },
  { name: "Encino", slug: "encino", image: img("1576941089067-2de3c901e126"), blurb: "Spacious San Fernando Valley living with great value." },
];

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}
