import { expect } from "chai";
import jwt from "jsonwebtoken";
import createdAuthorization from "../../src/utils/createdAuthorization.js";

describe("createdAuthorization util", () => {
  before(() => {
    process.env.SECRET_KEY_JWT = "test-secret";
  });

  it("creates access token with payload and can be verified", async () => {
    const { accessToken } = createdAuthorization();
    const token = await accessToken(42, "user");
    expect(token).to.be.a("string");
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    expect(decoded).to.have.property("user_id", 42);
    expect(decoded).to.have.property("role", "user");
  });

  it("generates a refresh token string", async () => {
    const { refreshToken } = createdAuthorization();
    const r = await refreshToken();
    expect(r).to.be.a("string");
    expect(r.length).to.be.greaterThan(0);
  });
});
