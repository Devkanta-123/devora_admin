import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import pumaSneakersImg from "@/assets/puma_sneakers.jpg";
import adidasJacketImg from "@/assets/adidas_jacket.jpg";
import levisJeansImg from "@/assets/levis_jeans.jpg";
import zaraCoatImg from "@/assets/zara_coat.jpg";

export type OrderStatus =
  | "Order Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type TimelineStep = {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  location?: string;
  completed: boolean;
  current: boolean;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  variant?: string;
};

export type Order = {
  id: string;
  orderDate: string;
  status: OrderStatus;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  paymentMethod: string;
  totalAmount: number;
  subtotal: number;
  shipping: number;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  shippingCarrier: string;
  trackingNumber: string;
  deliveryInformation: {
    customerName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  returnInformation: {
    eligible: boolean;
    policy: string;
    window: string;
    description: string;
  };
  timeline: TimelineStep[];
  items: OrderItem[];
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: "DEV-102938",
    orderDate: "September 6, 2026 • 10:45 AM",
    status: "Out for Delivery",
    paymentStatus: "Paid",
    paymentMethod: "UPI Instant Payment",
    totalAmount: 43998,
    subtotal: 43998,
    shipping: 0,
    estimatedDeliveryDate: "10 September 2026",
    shippingCarrier: "Devora Express Logistics",
    trackingNumber: "DV-EXP-992014",
    deliveryInformation: {
      customerName: "Alex Morgan",
      phone: "+91 98621 54321",
      addressLine1: "42 Linden Studio Complex, Babupara",
      city: "Imphal East",
      state: "Manipur",
      postalCode: "795005",
      country: "India",
    },
    returnInformation: {
      eligible: true,
      policy: "Easy 1–2 Day Return Policy",
      window: "Return eligible within 2 days of delivery",
      description: "Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.",
    },
    timeline: [
      {
        status: "Order Confirmed",
        label: "Order Confirmed",
        description: "Your order has been received and confirmed by Devora.",
        timestamp: "September 6, 2026 • 10:45 AM",
        location: "Devora Central System",
        completed: true,
        current: false,
      },
      {
        status: "Packed",
        label: "Packed",
        description: "Your order has been carefully packed and is ready to leave our warehouse.",
        timestamp: "September 7, 2026 • 04:30 PM",
        location: "Imphal East Hub",
        completed: true,
        current: false,
      },
      {
        status: "Shipped",
        label: "Shipped",
        description: "Your order has been handed over to our delivery partner.",
        timestamp: "September 8, 2026 • 08:15 AM",
        location: "Devora Logistics Center",
        completed: true,
        current: false,
      },
      {
        status: "Out for Delivery",
        label: "Out for Delivery",
        description: "Your Devora order is currently on its way to you.",
        timestamp: "September 9, 2026 • 09:00 AM",
        location: "Local Courier Van #04",
        completed: false,
        current: true,
      },
      {
        status: "Delivered",
        label: "Delivered",
        description: "Your order has been successfully delivered.",
        timestamp: "Expected: 10 September 2026 by 7:00 PM",
        location: "Customer Destination",
        completed: false,
        current: false,
      },
    ],
    items: [
      {
        id: "1",
        name: "Aurora Wireless Headphones",
        price: 18999,
        quantity: 1,
        image: p1,
        category: "Electronics",
        variant: "Matte Midnight Black",
      },
      {
        id: "2",
        name: "Meridian Leather Watch",
        price: 24999,
        quantity: 1,
        image: p2,
        category: "Accessories",
        variant: "Cognac Brown & Sapphire",
      },
    ],
  },
  {
    id: "DV-10293",
    orderDate: "September 1, 2026 • 03:20 PM",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card (Visa ending in 4242)",
    totalAmount: 18999,
    subtotal: 18999,
    shipping: 0,
    estimatedDeliveryDate: "Delivered on 3 September 2026",
    actualDeliveryDate: "3 September 2026 • 02:15 PM",
    shippingCarrier: "Devora Express Priority",
    trackingNumber: "DV-EXP-771239",
    deliveryInformation: {
      customerName: "Alex Morgan",
      phone: "+91 98621 54321",
      addressLine1: "42 Linden Studio Complex, Babupara",
      city: "Imphal East",
      state: "Manipur",
      postalCode: "795005",
      country: "India",
    },
    returnInformation: {
      eligible: true,
      policy: "Easy 1–2 Day Return Policy",
      window: "Return window active until 5 September 2026",
      description: "Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.",
    },
    timeline: [
      {
        status: "Order Confirmed",
        label: "Order Confirmed",
        description: "Your order has been received and confirmed by Devora.",
        timestamp: "September 1, 2026 • 03:20 PM",
        location: "Devora Central System",
        completed: true,
        current: false,
      },
      {
        status: "Packed",
        label: "Packed",
        description: "Your order has been carefully packed and is ready to leave our warehouse.",
        timestamp: "September 1, 2026 • 07:45 PM",
        location: "Imphal Fulfillment Center",
        completed: true,
        current: false,
      },
      {
        status: "Shipped",
        label: "Shipped",
        description: "Your order has been handed over to our delivery partner.",
        timestamp: "September 2, 2026 • 09:30 AM",
        location: "Devora Logistics Center",
        completed: true,
        current: false,
      },
      {
        status: "Out for Delivery",
        label: "Out for Delivery",
        description: "Your Devora order is currently on its way to you.",
        timestamp: "September 3, 2026 • 08:45 AM",
        location: "Local Courier Route",
        completed: true,
        current: false,
      },
      {
        status: "Delivered",
        label: "Delivered",
        description: "Your order has been successfully delivered.",
        timestamp: "September 3, 2026 • 02:15 PM",
        location: "Front Door / Reception",
        completed: true,
        current: true,
      },
    ],
    items: [
      {
        id: "1",
        name: "Aurora Wireless Headphones",
        price: 18999,
        quantity: 1,
        image: p1,
        category: "Electronics",
        variant: "Matte Midnight Black",
      },
    ],
  },
  {
    id: "DV-10199",
    orderDate: "September 4, 2026 • 01:10 PM",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "UPI Instant Payment",
    totalAmount: 17998,
    subtotal: 17998,
    shipping: 0,
    estimatedDeliveryDate: "10 September 2026",
    shippingCarrier: "BlueDart Express",
    trackingNumber: "BD-EXP-440912",
    deliveryInformation: {
      customerName: "Alex Morgan",
      phone: "+91 98621 54321",
      addressLine1: "42 Linden Studio Complex, Babupara",
      city: "Imphal East",
      state: "Manipur",
      postalCode: "795005",
      country: "India",
    },
    returnInformation: {
      eligible: true,
      policy: "Easy 1–2 Day Return Policy",
      window: "Return eligible within 2 days after delivery",
      description: "Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.",
    },
    timeline: [
      {
        status: "Order Confirmed",
        label: "Order Confirmed",
        description: "Your order has been received and confirmed by Devora.",
        timestamp: "September 4, 2026 • 01:10 PM",
        location: "Devora Central System",
        completed: true,
        current: false,
      },
      {
        status: "Packed",
        label: "Packed",
        description: "Your order has been carefully packed and is ready to leave our warehouse.",
        timestamp: "September 5, 2026 • 11:30 AM",
        location: "Warehouse A-12",
        completed: true,
        current: false,
      },
      {
        status: "Shipped",
        label: "Shipped",
        description: "Your order has been handed over to our delivery partner.",
        timestamp: "September 6, 2026 • 03:00 PM",
        location: "Air Cargo Hub",
        completed: false,
        current: true,
      },
      {
        status: "Out for Delivery",
        label: "Out for Delivery",
        description: "Your Devora order is currently on its way to you.",
        timestamp: "Expected: 9 September 2026",
        location: "Destination Facility",
        completed: false,
        current: false,
      },
      {
        status: "Delivered",
        label: "Delivered",
        description: "Your order has been successfully delivered.",
        timestamp: "Expected: 10 September 2026",
        location: "Recipient Address",
        completed: false,
        current: false,
      },
    ],
    items: [
      {
        id: "3",
        name: "Atelier Court Leather Sneakers",
        price: 9999,
        quantity: 1,
        image: p3,
        category: "Fashion",
        variant: "White / Natural Gum, Size 42",
      },
      {
        id: "9",
        name: "Puma RS-X Metallic Sneakers",
        price: 7999,
        quantity: 1,
        image: pumaSneakersImg,
        category: "Fashion",
        variant: "Silver / Black, Size 42",
      },
    ],
  },
  {
    id: "DV-10044",
    orderDate: "August 22, 2026 • 09:15 AM",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Cash on Delivery",
    totalAmount: 13998,
    subtotal: 13998,
    shipping: 0,
    estimatedDeliveryDate: "Delivered on 25 August 2026",
    actualDeliveryDate: "25 August 2026 • 04:40 PM",
    shippingCarrier: "Devora Express",
    trackingNumber: "DV-EXP-110943",
    deliveryInformation: {
      customerName: "Alex Morgan",
      phone: "+91 98621 54321",
      addressLine1: "42 Linden Studio Complex, Babupara",
      city: "Imphal East",
      state: "Manipur",
      postalCode: "795005",
      country: "India",
    },
    returnInformation: {
      eligible: false,
      policy: "Easy 1–2 Day Return Policy",
      window: "Return period ended on 27 August 2026",
      description: "Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.",
    },
    timeline: [
      {
        status: "Order Confirmed",
        label: "Order Confirmed",
        description: "Your order has been received and confirmed by Devora.",
        timestamp: "August 22, 2026 • 09:15 AM",
        completed: true,
        current: false,
      },
      {
        status: "Packed",
        label: "Packed",
        description: "Your order has been carefully packed and is ready to leave our warehouse.",
        timestamp: "August 22, 2026 • 02:00 PM",
        completed: true,
        current: false,
      },
      {
        status: "Shipped",
        label: "Shipped",
        description: "Your order has been handed over to our delivery partner.",
        timestamp: "August 23, 2026 • 08:30 AM",
        completed: true,
        current: false,
      },
      {
        status: "Out for Delivery",
        label: "Out for Delivery",
        description: "Your Devora order is currently on its way to you.",
        timestamp: "August 25, 2026 • 10:15 AM",
        completed: true,
        current: false,
      },
      {
        status: "Delivered",
        label: "Delivered",
        description: "Your order has been successfully delivered.",
        timestamp: "August 25, 2026 • 04:40 PM",
        completed: true,
        current: true,
      },
    ],
    items: [
      {
        id: "14",
        name: "Zara Tailored Wool Blend Overcoat",
        price: 8999,
        quantity: 1,
        image: zaraCoatImg,
        category: "Fashion",
        variant: "Camel Wool, Size M",
      },
      {
        id: "11",
        name: "Levi's 501 Original Denim Jeans",
        price: 4999,
        quantity: 1,
        image: levisJeansImg,
        category: "Fashion",
        variant: "Classic Indigo, 32W 32L",
      },
    ],
  },
  {
    id: "DEV-20451",
    orderDate: "September 7, 2026 • 06:15 PM",
    status: "Packed",
    paymentStatus: "Paid",
    paymentMethod: "UPI Instant Payment",
    totalAmount: 20498,
    subtotal: 20498,
    shipping: 0,
    estimatedDeliveryDate: "10 September 2026",
    shippingCarrier: "Devora Priority Express",
    trackingNumber: "DV-EXP-662890",
    deliveryInformation: {
      customerName: "Alex Morgan",
      phone: "+91 98621 54321",
      addressLine1: "42 Linden Studio Complex, Babupara",
      city: "Imphal East",
      state: "Manipur",
      postalCode: "795005",
      country: "India",
    },
    returnInformation: {
      eligible: true,
      policy: "Easy 1–2 Day Return Policy",
      window: "Return eligible within 2 days after delivery",
      description: "Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.",
    },
    timeline: [
      {
        status: "Order Confirmed",
        label: "Order Confirmed",
        description: "Your order has been received and confirmed by Devora.",
        timestamp: "September 7, 2026 • 06:15 PM",
        location: "Devora Central System",
        completed: true,
        current: false,
      },
      {
        status: "Packed",
        label: "Packed",
        description: "Your order has been carefully packed and is ready to leave our warehouse.",
        timestamp: "September 8, 2026 • 11:20 AM",
        location: "Imphal Packing Station 2",
        completed: false,
        current: true,
      },
      {
        status: "Shipped",
        label: "Shipped",
        description: "Your order has been handed over to our delivery partner.",
        timestamp: "Expected 9 September 2026",
        location: "Warehouse Dispatch Bay",
        completed: false,
        current: false,
      },
      {
        status: "Out for Delivery",
        label: "Out for Delivery",
        description: "Your Devora order is currently on its way to you.",
        timestamp: "Expected 9 September 2026",
        location: "Local Courier Route",
        completed: false,
        current: false,
      },
      {
        status: "Delivered",
        label: "Delivered",
        description: "Your order has been successfully delivered.",
        timestamp: "Expected: 10 September 2026",
        location: "Recipient Address",
        completed: false,
        current: false,
      },
    ],
    items: [
      {
        id: "4",
        name: "Voyager Leather Backpack",
        price: 14999,
        quantity: 1,
        image: p4,
        category: "Accessories",
        variant: "Vegetable Tanned Leather",
      },
      {
        id: "10",
        name: "Adidas Originals Track Jacket",
        price: 5499,
        quantity: 1,
        image: adidasJacketImg,
        category: "Fashion",
        variant: "Black / White Stripes, Size L",
      },
    ],
  },
];

const STORAGE_KEY = "devora_orders_data_v3";

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed: Order[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrder(newOrder: Order): void {
  try {
    const orders = getStoredOrders();
    const updated = [newOrder, ...orders.filter((o) => o.id !== newOrder.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save order to localStorage:", err);
  }
}

export function findOrderByQuery(query: string): Order | undefined {
  if (!query) return undefined;
  const clean = query.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const orders = getStoredOrders();

  return orders.find((o) => {
    const oIdClean = o.id.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (oIdClean === clean) return true;
    const strippedOId = oIdClean.replace(/^(DEV|DV)/, "");
    const strippedQuery = clean.replace(/^(DEV|DV)/, "");
    return strippedOId.length >= 4 && strippedOId === strippedQuery;
  });
}

// Simulated asynchronous API fetch with animated timeline delay
export async function fetchOrderByTrackingId(query: string): Promise<Order | null> {
  const found = findOrderByQuery(query);
  return found || null;
}
