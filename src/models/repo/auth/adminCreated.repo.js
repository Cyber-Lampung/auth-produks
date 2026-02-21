import db from "../../../config/db.config.js";

export const saveAdmin = async (
  user_id,
  email,
  username,
  hashPassword,
  role,
) => {
  const [resQuery] = await db.query(
    "insert into users (user_id, email, username, password, role, created) values (?, ?, ?, ?, ?, NOW())",
    [user_id, email, username, hashPassword, role],
  );

  if (resQuery) {
    return { status: true };
  } else {
    return { status: false };
  }
};

export const saveToken = async (session_id, user_id, refreshToken) => {
  const [resQuery] = await db.query(
    "insert into sessions (session_id, user_id, refreshToken, created, expiress, isActive) values (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1) ",
    [session_id, user_id, refreshToken],
  );

  if (resQuery) {
    return { status: true };
  } else {
    return { status: false };
  }
};

// return { saveAdmin, saveToken };
