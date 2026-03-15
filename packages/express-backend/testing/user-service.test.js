import { jest } from "@jest/globals";

const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockSave = jest.fn();

const MockUser = jest.fn(function (user) {
  this.user = user;
  this.save = mockSave;
});

MockUser.find = mockFind;
MockUser.findById = mockFindById;
MockUser.findByIdAndDelete = mockFindByIdAndDelete;

jest.unstable_mockModule("../auth.js", () => ({
  User: MockUser
}));

const userService = (await import("../services/user-service.js")).default;

describe("user-service", () => {
  beforeEach(() => {
    mockFind.mockClear();
    mockFindById.mockClear();
    mockFindByIdAndDelete.mockClear();
    mockSave.mockClear();
    MockUser.mockClear();
  });

  test("getUsers with no name and no job calls find with nothing", () => {
    userService.getUsers();

    expect(mockFind).toHaveBeenCalledWith();
  });

  test("findUserById calls findById with id", () => {
    userService.findUserById("123");

    expect(mockFindById).toHaveBeenCalledWith("123");
  });

  test("addUser makes a new user and saves it", () => {
    const newUser = { fullName: "Bob", major: "CS" };

    userService.addUser(newUser);

    expect(MockUser).toHaveBeenCalledWith(newUser);
    expect(mockSave).toHaveBeenCalled();
  });

  test("findUserByName calls find with fullName", () => {
    userService.findUserByName("Bob");

    expect(mockFind).toHaveBeenCalledWith({ fullName: "Bob" });
  });

  test("findUserByJob calls find with major", () => {
    userService.findUserByJob("CS");

    expect(mockFind).toHaveBeenCalledWith({ major: "CS" });
  });

  test("findUserByNameAndJob calls find with both fields", () => {
    userService.findUserByNameAndJob("Bob", "CS");

    expect(mockFind).toHaveBeenCalledWith({ fullName: "Bob", major: "CS" });
  });

  test("removeUser calls findByIdAndDelete with id", () => {
    userService.removeUser("123");

    expect(mockFindByIdAndDelete).toHaveBeenCalledWith("123");
  });

  test("getUsers with only name calls findUserByName logic", () => {
    userService.getUsers("Bob");

    expect(mockFind).toHaveBeenCalledWith({ fullName: "Bob" });
  });

  test("getUsers with only job calls findUserByJob logic", () => {
    userService.getUsers(undefined, "CS");

    expect(mockFind).toHaveBeenCalledWith({ major: "CS" });
  });

  test("getUsers with name and job calls findUserByNameAndJob logic", () => {
    userService.getUsers("Bob", "CS");

    expect(mockFind).toHaveBeenCalledWith({ fullName: "Bob", major: "CS" });
  });
});