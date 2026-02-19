import bcrypt from "bcrypt";

export default async function passwordHashing() {
  const passwordHash = async (passwod) => {
    const hashPassword = await bcrypt.hash(passwod, 10);

    return hashPassword;
  };

  const comparePassword = async (passwod, passwodHashDb) => {
    const comparePass = await bcrypt.compare(passwod, passwodHashDb);

    return comparePass;
  };

  return { passwordHash, comparePassword };
}
