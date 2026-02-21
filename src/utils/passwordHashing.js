import bcrypt from "bcrypt";

export default async function passwordHashing() {
  const passwordHash = async (password) => {
    const hashPassword = await bcrypt.hash(password, 10);

    return hashPassword;
  };

  const comparePassword = async (passwod, passwodHashDb) => {
    const comparePass = await bcrypt.compare(passwod, passwodHashDb);

    return comparePass;
  };

  return { passwordHash, comparePassword };
}
