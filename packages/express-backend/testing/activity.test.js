import Activity from "../models/activity.js";

describe("Activity Model", () => {
  test("should create an Activity document with all fields", () => {
    const activity = new Activity({
      username: "bob",
      restaurantName: "Julian's",
      time: "6:00 PM",
      message: "Great food!",
      hasImages: true,
      rating: 5,
      type: "review"
    });

    expect(activity.username).toBe("bob");
    expect(activity.restaurantName).toBe("Julian's");
    expect(activity.time).toBe("6:00 PM");
    expect(activity.message).toBe("Great food!");
    expect(activity.hasImages).toBe(true);
    expect(activity.rating).toBe(5);
    expect(activity.type).toBe("review");
  });
});
