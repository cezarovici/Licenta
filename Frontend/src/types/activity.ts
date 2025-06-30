export interface Activity {
  id: number;
  name: string; // ex: "Teren fotbal", "Clasă Yoga", "Piscină"
  description: string | null;
  duration: number; // în minute
  price: number;
}
