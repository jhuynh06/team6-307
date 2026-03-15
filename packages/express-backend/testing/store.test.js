import Store from "../models/store.js";

describe("Store Model", () => {
  test("should create a Store document with all fields", () => {
    const store = new Store({
      name: "Julian's",
      hours: "9am - 6pm",
      rating: 4.5,
      reviewCount: 10,
      isOpen: true,
      bannerImage: "banner.jpg",
      cardImage: "card.jpg",
      profileImage: "profile.jpg",
      products: [
        {
          name: "Coffee",
          category: "Drink",
          inStock: true,
          description: "fresh coffee",
          tags: ["milk", "sugar"],
          image: "coffee.jpg",
          reviews: [
            {
              user: "bob",
              text: "Great coffee!",
              rating: 5
            }
          ]
        }
      ]
    });

    expect(store.name).toBe("Julian's");
    expect(store.hours).toBe("9am - 6pm");
    expect(store.rating).toBe(4.5);
    expect(store.reviewCount).toBe(10);
    expect(store.isOpen).toBe(true);

    expect(store.bannerImage).toBe("banner.jpg");
    expect(store.cardImage).toBe("card.jpg");
    expect(store.profileImage).toBe("profile.jpg");

    expect(store.products.length).toBe(1);
    expect(store.products[0].name).toBe("Coffee");

    expect(store.products[0].reviews.length).toBe(1);
    expect(store.products[0].reviews[0].user).toBe("bob");
    expect(store.products[0].reviews[0].rating).toBe(5);
  });
});
