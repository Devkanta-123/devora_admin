import { describe, it, expect } from "vitest";
import { T_SHIRTS, SNEAKERS, convertToStoreProduct } from "@/data/clothesRailProducts";
import { products } from "@/data/products";

describe("Virtual Clothes Rail Dataset & Models", () => {
  it("should have comprehensive T-Shirt items with colors and sizes", () => {
    expect(T_SHIRTS.length).toBeGreaterThanOrEqual(8);
    T_SHIRTS.forEach((tee) => {
      expect(tee.category).toBe("t-shirt");
      expect(tee.fixtureType).toBe("hanger");
      expect(tee.colors.length).toBeGreaterThanOrEqual(2);
      expect(tee.sizes.length).toBeGreaterThanOrEqual(3);
      expect(tee.price).toBeGreaterThan(0);
      tee.colors.forEach((c) => {
        expect(c.image).toBeDefined();
        expect(c.image.length).toBeGreaterThan(10);
      });
    });
  });

  it("should have comprehensive Sneaker items with shoe-rack fixtures and colors", () => {
    expect(SNEAKERS.length).toBeGreaterThanOrEqual(8);
    SNEAKERS.forEach((sneaker) => {
      expect(sneaker.category).toBe("shoes");
      expect(sneaker.fixtureType).toBe("shoe-rack");
      expect(sneaker.colors.length).toBeGreaterThanOrEqual(2);
      expect(sneaker.sizes.length).toBeGreaterThanOrEqual(4);
      expect(sneaker.price).toBeGreaterThan(0);
      sneaker.colors.forEach((c) => {
        expect(c.image).toBeDefined();
        expect(c.image.length).toBeGreaterThan(10);
      });
    });
  });

  it("should seamlessly convert and register items in the main store products list", () => {
    const converted = convertToStoreProduct(T_SHIRTS[0]);
    expect(converted.id).toBe(T_SHIRTS[0].id);
    expect(converted.name).toBe(T_SHIRTS[0].name);

    // Verify all rail items exist in the main products catalog
    const allIds = new Set(products.map((p) => p.id));
    T_SHIRTS.forEach((t) => expect(allIds.has(t.id)).toBe(true));
    SNEAKERS.forEach((s) => expect(allIds.has(s.id)).toBe(true));
  });
});
