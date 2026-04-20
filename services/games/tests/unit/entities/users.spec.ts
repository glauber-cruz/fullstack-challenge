import { User } from "../../../src/domain/entites/users.entity";
import { describe, expect, it } from "vitest";

describe("User entity", () => {
  it("should create a user with correct data", () => {
    const user = User.create({
      email: "john@doe.com",
      name: "John Doe",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("john@doe.com");
    expect(user.name).toBe("John Doe");
    expect(user.createdAt).toBeUndefined();
    expect(user.updatedAt).toBeUndefined();
  });
});
