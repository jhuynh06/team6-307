import Store from "../models/store.js";

describe("Store Model", () => {

  test("should create a Store document with all fields", () => {
    const store = new Store({
      name: "Bob's Market",
      hours: "9am - 9pm",
      rating: 4.5,
      reviewCount: 10,
      isOpen: true,
      bannerImage: "banner.jpg",
      cardImage: "card.jpg",
      profileImage: "profile.jpg",
      products: [
        {
          name: "Pizza",
          category: "Food",
          inStock: true,
          description: "Delicious pizza",
          tags: ["cheese", "italian"],
          image: "pizza.jpg",
          reviews: [
            {
              user: "bob",
              text: "Great pizza!",
              rating: 5
            }
          ]
        }
      ]
    });

    expect(store.name).toBe("Bob's Market");
    expect(store.hours).toBe("9am - 9pm");
    expect(store.rating).toBe(4.5);
    expect(store.reviewCount).toBe(10);
    expect(store.isOpen).toBe(true);

    expect(store.bannerImage).toBe("banner.jpg");
    expect(store.cardImage).toBe("card.jpg");
    expect(store.profileImage).toBe("profile.jpg");

    expect(store.products.length).toBe(1);
    expect(store.products[0].name).toBe("Pizza");

    expect(store.products[0].reviews.length).toBe(1);
    expect(store.products[0].reviews[0].user).toBe("bob");
    expect(store.products[0].reviews[0].rating).toBe(5);
  });
});