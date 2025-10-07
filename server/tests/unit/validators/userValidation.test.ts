import {
  validateRegistration,
  validateLogin,
  validatePassword
} from "../../../src/validators/userValidation";

describe("[UNIT]: validators/userValidation", () => {
  describe("validateRegistration", () => {
    it("should pass for valid input", () => {
      const data = { username: "testuser", email: "test@example.com", password: "Password123!" };
      const result = validateRegistration(data);
      expect(result.error).toBeUndefined();
    });

    it("should fail for invalid email", () => {
      const data = { username: "testuser", email: "invalid-email", password: "Password123!" };
      const result = validateRegistration(data);
      expect(result.error).toBeDefined();
    });

    it("should fail for empty username", () => {
      const data = { username: "", email: "test@example.com", password: "Password123!" };
      const result = validateRegistration(data);
      expect(result.error).toBeDefined();
    });

    it("should fail for weak password", () => {
      const data = { username: "user", email: "test@example.com", password: "123" };
      const result = validateRegistration(data);
      expect(result.error).toBeDefined();
    });
  });

  describe("validateLogin", () => {
    it("should pass for valid input", () => {
      const data = { email: "test@example.com", password: "Password123!" };
      const result = validateLogin(data);
      expect(result.error).toBeUndefined();
    });

    it("should fail for invalid email", () => {
      const data = { email: "invalid", password: "Password123!" };
      const result = validateLogin(data);
      expect(result.error).toBeDefined();
    });

    it("should fail for empty password", () => {
      const data = { email: "test@example.com", password: "" };
      const result = validateLogin(data);
      expect(result.error).toBeDefined();
    });
  });

  describe("validatePassword", () => {
    it("should pass for strong password", () => {
      const result = validatePassword("Password123!");
      expect(result.error).toBeUndefined();
    });

    it("should fail for weak password", () => {
      const result = validatePassword("123");
      expect(result.error).toBeDefined();
    });
  });
});
