import Activity from "../models/activity.js";

describe("Activity Model", () => {

  test("should create an Activity document with all fields", () => {
    const activity = new Activity({
      username: "john123",
      restaurantName: "Pizza Hut",
      time: "7:00 PM",
      message: "Great food!",
      hasImages: true,
      rating: 5,
      type: "review"
    });

    expect(activity.username).toBe("john123");
    expect(activity.restaurantName).toBe("Pizza Hut");
    expect(activity.time).toBe("7:00 PM");
    expect(activity.message).toBe("Great food!");
    expect(activity.hasImages).toBe(true);
    expect(activity.rating).toBe(5);
    expect(activity.type).toBe("review");
  });

});