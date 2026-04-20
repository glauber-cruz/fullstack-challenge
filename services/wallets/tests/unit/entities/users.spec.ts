import { describe, expect, it } from "vitest";

import { User } from "../../../src/domain/entites/users.entity";

describe("User entity", () => {
  it("should create a user", () => {
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
