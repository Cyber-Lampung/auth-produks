import { expect } from "chai";
import passwordHashing from "../../src/utils/passwordHashing.js";

describe("passwordHashing util", () => {
  it("hashes and verifies password correctly", async () => {
    const { passwordHash, comparePassword } = await passwordHashing();
    const plain = "Secret123!";
    const hash = await passwordHash(plain);
    expect(hash).to.be.a("string");
    const match = await comparePassword(plain, hash);
    expect(match).to.equal(true);
    const wrong = await comparePassword("Wrong", hash);
    expect(wrong).to.equal(false);
  });
});
