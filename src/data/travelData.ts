export interface Destination {
  id: number;
  title: string;
  image: string;
  price: string;
  rating: number;
  category: "Tropical" | "Adventure" | "Romantic" | "City Break" | "Beach" | "Mountain" | "Luxury" | "Budget" | "Family" | "Cultural" | "Heritage";
  description: string;
  mapUrl?: string;
}

export const featuredDestinations: Destination[] = [
  {
    id: 1,
    title: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    price: "$1,200",
    rating: 4.9,
    category: "Tropical",
    description: "Experience the magic of Bali with its lush jungles and pristine beaches.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Bali+Indonesia"
  },
  {
    id: 6,
    title: "Jaipur, Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    price: "₹15,000",
    rating: 4.8,
    category: "Heritage",
    description: "The Pink City of India, known for its magnificent palaces and vibrant bazaars.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Jaipur+Rajasthan+India"
  },
  {
    id: 7,
    title: "Kerala Backwaters",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    price: "₹25,000",
    rating: 4.9,
    category: "Tropical",
    description: "Serene boat rides through the lush green palm-fringed backwaters of Alleppey.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Alleppey+Backwaters+Kerala+India"
  },
  {
    id: 8,
    title: "Leh Ladakh",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    price: "₹45,000",
    rating: 4.9,
    category: "Mountain",
    description: "High-altitude desert landscapes, crystal clear lakes, and ancient Buddhist monasteries.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Leh+Ladakh+India"
  },
  {
    id: 2,
    title: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    price: "$2,500",
    rating: 4.8,
    category: "Adventure",
    description: "Conquer the peaks and enjoy the breathtaking views of the Swiss Alps.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Swiss+Alps"
  },
  {
    id: 9,
    title: "Goa Beaches",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    price: "₹12,000",
    rating: 4.7,
    category: "Beach",
    description: "The party capital of India, offering beautiful beaches and Portuguese heritage.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Goa+India"
  },
  {
    id: 3,
    title: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    price: "$1,800",
    rating: 4.7,
    category: "Romantic",
    description: "Romantic sunsets and blue-domed churches await in Santorini.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Santorini+Greece"
  },
  {
    id: 10,
    title: "Varanasi Ghats",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    price: "₹10,000",
    rating: 4.8,
    category: "Cultural",
    description: "One of the oldest living cities in the world, famous for its spiritual river ghats.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Varanasi+India"
  },
  {
    id: 11,
    title: "Udaipur Lakes",
    image: "https://images.unsplash.com/photo-1590432328639-65e6d97c36a3?auto=format&fit=crop&w=800&q=80",
    price: "₹20,000",
    rating: 4.9,
    category: "Romantic",
    description: "The City of Lakes, known for its royal palaces and majestic lake views.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Udaipur+Rajasthan+India"
  },
  {
    id: 4,
    title: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    price: "$1,500",
    rating: 4.9,
    category: "City Break",
    description: "Traditional temples and beautiful zen gardens in the heart of Japan.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kyoto+Japan"
  },
  {
    id: 12,
    title: "Hampi Ruins",
    image: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80",
    price: "₹18,000",
    rating: 4.7,
    category: "Heritage",
    description: "UNESCO World Heritage site featuring the majestic ruins of the Vijayanagara Empire.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Hampi+Karnataka+India"
  },
  {
    id: 13,
    title: "Mumbai City",
    image: "https://images.unsplash.com/photo-1570160897040-3a2b5170193e?auto=format&fit=crop&w=800&q=80",
    price: "₹22,000",
    rating: 4.8,
    category: "City Break",
    description: "The City of Dreams, known for its colonial architecture, Bollywood, and iconic Marine Drive.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Mumbai+Maharashtra+India"
  },
  {
    id: 14,
    title: "Rishikesh Yoga",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    price: "₹12,000",
    rating: 4.9,
    category: "Cultural",
    description: "The Yoga Capital of the World, situated in the foothills of the Himalayas along the Ganges.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Rishikesh+Uttarakhand+India"
  },
  {
    id: 15,
    title: "Munnar Tea Hills",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    price: "₹18,000",
    rating: 4.8,
    category: "Tropical",
    description: "Rolling hills of tea plantations, misty valleys, and exotic flora in the Western Ghats.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Munnar+Kerala+India"
  },
  {
    id: 16,
    title: "Ladakh Pangong Lake",
    image: "https://images.unsplash.com/photo-1589136142558-9dec889cc46e?auto=format&fit=crop&w=800&q=80",
    price: "₹35,000",
    rating: 4.9,
    category: "Adventure",
    description: "Stunning high-altitude lake known for its changing colors and dramatic mountain backdrop.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Pangong+Lake+Ladakh+India"
  },
  {
    id: 5,
    title: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    price: "$2,200",
    rating: 4.8,
    category: "Luxury",
    description: "Stunning coastal views and charming Italian villages.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Amalfi+Coast+Italy"
  }
];

export const categories = [
  "All", "Beach", "Mountain", "City Break", "Adventure", "Luxury", "Budget", "Family", "Cultural", "Heritage"
];
