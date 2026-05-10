export interface Destination {
  id: number;
  title: string;
  image: string;
  price: string;
  rating: number;
  category: "Tropical" | "Adventure" | "Romantic" | "City Break" | "Beach" | "Mountain" | "Luxury" | "Budget" | "Family";
  description: string;
}

export const featuredDestinations: Destination[] = [
  {
    id: 1,
    title: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    price: "$1,200",
    rating: 4.9,
    category: "Tropical",
    description: "Experience the magic of Bali with its lush jungles and pristine beaches."
  },
  {
    id: 2,
    title: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    price: "$2,500",
    rating: 4.8,
    category: "Adventure",
    description: "Conquer the peaks and enjoy the breathtaking views of the Swiss Alps."
  },
  {
    id: 3,
    title: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    price: "$1,800",
    rating: 4.7,
    category: "Romantic",
    description: "Romantic sunsets and blue-domed churches await in Santorini."
  },
  {
    id: 4,
    title: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    price: "$1,500",
    rating: 4.9,
    category: "City Break",
    description: "Traditional temples and beautiful zen gardens in the heart of Japan."
  },
  {
    id: 5,
    title: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    price: "$2,200",
    rating: 4.8,
    category: "Luxury",
    description: "Stunning coastal views and charming Italian villages."
  }
];

export const categories = [
  "All", "Beach", "Mountain", "City Break", "Adventure", "Luxury", "Budget", "Family"
];
