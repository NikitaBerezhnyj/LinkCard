// tests/unit/jwtHelper.test.ts
import * as jwtHelper from "../../../src/utils/jwtHelper";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("jwtHelper", () => {
  describe("generateAuthToken", () => {
    it("should call jwt.sign with correct payload and secret", () => {
      const userId = "123";
      const username = "testuser";

      (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

      const token = jwtHelper.generateAuthToken(userId, username);

      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: userId, username },
        process.env.JWT_PRIVATE_TOKEN,
        { expiresIn: "7d" }
      );

      expect(token).toBe("mockedToken");
    });
  });
});
