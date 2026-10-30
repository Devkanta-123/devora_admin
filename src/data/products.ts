import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";
import pumaSneakersImg from "@/assets/puma_sneakers.jpg";
import adidasJacketImg from "@/assets/adidas_jacket.jpg";
import adidasWindbreakerImg from "@/assets/adidas_windbreaker.jpg";
import hmHoodieImg from "@/assets/hm_hoodie.jpg";
import levisJeansImg from "@/assets/levis_jeans.jpg";
import zaraCoatImg from "@/assets/zara_coat.jpg";
import { T_SHIRTS, SNEAKERS, convertToStoreProduct } from "./clothesRailProducts";
export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  trending?: boolean;
  featured?: boolean;
};

export const categories = [
  { slug: "electronics", name: "Electronics", count: 12 },
  { slug: "fashion", name: "Fashion & Clothing", count: 32 },
  { slug: "accessories", name: "Accessories", count: 18 },
  { slug: "home", name: "Home & Living", count: 15 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Aurora Wireless Headphones",
    price: 18999,
    category: "electronics",
    rating: 4.8,
    reviews: 248,
    image: p1,
    description: "Studio-grade active noise cancellation with 40-hour battery life. Premium memory foam cushions and lossless audio over Bluetooth 5.3.",
    trending: true,
    featured: true,
  },
  {
    id: "2",
    name: "Meridian Leather Watch",
    price: 24999,
    category: "accessories",
    rating: 4.9,
    reviews: 192,
    image: p2,
    description: "Sapphire crystal, Swiss movement, full-grain Italian leather strap. Water resistant to 50 meters.",
    trending: true,
    featured: true,
  },
  {
    id: "3",
    name: "Atelier Court Leather Sneakers",
    price: 9999,
    category: "fashion",
    rating: 4.7,
    reviews: 312,
    image: p3,
    description: "Hand-finished Italian leather sneakers with cork-lined insoles. Made in Portugal.",
    trending: true,
    featured: true,
  },
  {
    id: "4",
    name: "Voyager Leather Backpack",
    price: 14999,
    category: "accessories",
    rating: 4.8,
    reviews: 156,
    image: p4,
    description: "Full-grain vegetable-tanned leather. Padded laptop sleeve fits up to 16 inches. Solid brass hardware.",
    featured: true,
  },
  {
    id: "5",
    name: "Echo Pro Earbuds",
    price: 8999,
    category: "electronics",
    rating: 4.6,
    reviews: 421,
    image: p5,
    description: "Spatial audio, adaptive transparency and a wireless charging case. All day comfort.",
    trending: true,
  },
  {
    id: "6",
    name: "Tortoise Shell Sunglasses",
    price: 4499,
    category: "fashion",
    rating: 4.5,
    reviews: 89,
    image: p6,
    description: "Hand-polished acetate frames with polarized CR-39 lenses. Lightweight titanium hinges.",
  },
  {
    id: "7",
    name: "Sage Ceramic Mug Set",
    price: 1299,
    category: "home",
    rating: 4.9,
    reviews: 540,
    image: p7,
    description: "Stoneware ceramic glazed in soft sage. Microwave and dishwasher safe. Set of two.",
  },
  {
    id: "8",
    name: "Brass Studio Lamp",
    price: 6499,
    category: "home",
    rating: 4.7,
    reviews: 132,
    image: p8,
    description: "Solid brass desk lamp with warm dimmable LED. Hand-spun shade and weighted base.",
  },
  {
    id: "9",
    name: "Puma RS-X Metallic Sneakers",
    price: 7999,
    category: "fashion",
    rating: 4.8,
    reviews: 215,
    image: pumaSneakersImg,
    description: "Puma RS-X retro-futuristic sneakers featuring cushioned Running System technology, mesh & synthetic leather upper.",
    trending: true,
    featured: true,
  },
  {
    id: "10",
    name: "Adidas Originals Track Jacket",
    price: 5499,
    category: "fashion",
    rating: 4.9,
    reviews: 340,
    image: adidasJacketImg,
    description: "Iconic Adidas 3-Stripes track jacket in heavyweight recycled tricot with zip side pockets and ribbed stand-up collar.",
    trending: true,
    featured: true,
  },
  {
    id: "11",
    name: "Levi's 501 Original Denim Jeans",
    price: 4999,
    category: "fashion",
    rating: 4.9,
    reviews: 480,
    image: levisJeansImg,
    description: "The original button-fly blue jean since 1873. Crafted from 100% heavy cotton denim with signature red tab branding.",
    trending: true,
    featured: true,
  },
  {
    id: "12",
    name: "Adidas Trefoil Hooded Windbreaker",
    price: 6999,
    category: "fashion",
    rating: 4.8,
    reviews: 128,
    image: adidasWindbreakerImg,
    description: "Lightweight weather-resistant Adidas Trefoil hooded windbreaker with full-zip front, elastic cuffs, and breathable mesh lining.",
    featured: true,
  },
  {
    id: "13",
    name: "H&M Premium Heavy Cotton Hoodie",
    price: 3499,
    category: "fashion",
    rating: 4.7,
    reviews: 310,
    image: hmHoodieImg,
    description: "Relaxed oversized heavyweight fleece hoodie crafted from organic cotton with double-layer drawstring hood.",
    trending: true,
    featured: true,
  },
  {
    id: "14",
    name: "Zara Tailored Wool Blend Overcoat",
    price: 8999,
    category: "fashion",
    rating: 4.9,
    reviews: 165,
    image: zaraCoatImg,
    description: "Elegant double-breasted long wool blend coat featuring notch lapels, flap pockets, and back vent for effortless layering.",
    featured: true,
  },
  ...T_SHIRTS.map(convertToStoreProduct),
  ...SNEAKERS.map(convertToStoreProduct),
];
