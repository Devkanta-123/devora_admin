import { describe, it, expect, beforeEach } from "vitest";
import { findOrderByQuery, fetchOrderByTrackingId, getStoredOrders, saveStoredOrder, Order } from "../data/orders";

describe("Order Tracking & Data Logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should find an order by exact DEV-102938 ID", () => {
    const order = findOrderByQuery("DEV-102938");
    expect(order).toBeDefined();
    expect(order?.id).toBe("DEV-102938");
    expect(order?.status).toBe("Out for Delivery");
    expect(order?.items.length).toBeGreaterThan(0);
  });

  it("should find an order case-insensitively and with flexible prefix", () => {
    const orderLower = findOrderByQuery("dev-102938");
    expect(orderLower).toBeDefined();
    expect(orderLower?.id).toBe("DEV-102938");

    const orderDV = findOrderByQuery("dv-10293");
    expect(orderDV).toBeDefined();
    expect(orderDV?.id).toBe("DV-10293");
  });

  it("should return undefined for invalid order IDs", () => {
    const notFound = findOrderByQuery("INVALID-99999");
    expect(notFound).toBeUndefined();

    const empty = findOrderByQuery("");
    expect(empty).toBeUndefined();
  });

  it("should fetch order via async API correctly", async () => {
    const order = await fetchOrderByTrackingId("DEV-102938");
    expect(order).not.toBeNull();
    expect(order?.id).toBe("DEV-102938");

    const invalid = await fetchOrderByTrackingId("UNKNOWN-ID");
    expect(invalid).toBeNull();
  });

  it("should save and retrieve a newly created order", () => {
    const newOrder: Order = {
      id: "DEV-777888",
      orderDate: "May 4, 2026 • 05:00 PM",
      status: "Order Confirmed",
      paymentStatus: "Paid",
      paymentMethod: "UPI Instant Payment",
      totalAmount: 9999,
      subtotal: 9999,
      shipping: 0,
      estimatedDeliveryDate: "In 3 business days",
      shippingCarrier: "Devora Express",
      trackingNumber: "DV-EXP-777888",
      deliveryInformation: {
        customerName: "Alex Morgan",
        phone: "+91 98621 54321",
        addressLine1: "42 Linden Studio Complex",
        city: "Imphal East",
        state: "Manipur",
        postalCode: "795005",
        country: "India",
      },
      returnInformation: {
        eligible: true,
        policy: "Easy 1–2 Day Return Policy",
        window: "Eligible for return within 1–2 days of delivery",
        description: "Eligible products can be returned within 1–2 days of delivery, subject to Devora's return conditions.",
      },
      timeline: [
        {
          status: "Order Confirmed",
          label: "Order Confirmed",
          description: "Your order has been received and confirmed by Devora.",
          completed: true,
          current: true,
        },
      ],
      items: [],
    };

    saveStoredOrder(newOrder);

    const retrieved = findOrderByQuery("DEV-777888");
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe("DEV-777888");
  });
});
