import Product from "../models/product.js";

describe("Product Model", () => {

  test("should create a Product document with all fields", () => {
    const product = new Product({
      name: "Pizza",
      category: "Food",
      inStock: true,
      description: "Delicious pizza",
      tags: ["cheese", "italian"],
      image: "pizza.jpg",
      reviews: [
        {
          user: "bob",
          text: "I love food",
          rating: 5,
          date: new Date()
        }
      ]
    });

    expect(product.name).toBe("Pizza");
    expect(product.category).toBe("Food");
    expect(product.inStock).toBe(true);
    expect(product.description).toBe("Delicious pizza");
    expect(product.tags).toContain("cheese");
    expect(product.image).toBe("pizza.jpg");

    expect(product.reviews.length).toBe(1);
    expect(product.reviews[0].user).toBe("bob");
    expect(product.reviews[0].text).toBe("I love food");
    expect(product.reviews[0].rating).toBe(5);
  });

});