import { v4 as uuidV4 } from "uuid";

export default async function generateUUID() {
  const uuid = uuidV4();

  return uuid;
}
