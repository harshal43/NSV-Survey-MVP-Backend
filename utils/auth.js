import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {getUSerFromUserId} from "../queries/userauth.js";

dotenv.config();

async function decryptheader(header) {
  try {
    console.log(">>>header: ", header);
    const token = header.authorization;
    const tokenValue = token ? token.split(" ")[1] : null;
    console.log(">>>tokenValue: ", tokenValue);

    if (!tokenValue) {
      throw new Error("No token provided");
    }

    const jwtSecretKey = process.env.JWT_SECRET;
    const verified = jwt.verify(tokenValue, jwtSecretKey);

    if (verified) {
      console.log("Token passed Successfully");
      return verified;
    } else {
      throw new Error("Unsuccessful Verification");
    }
  } catch (error) {
    logger.error(error, "error in token");
    throw new Error(error);
  }
}

async function authvalidation(header, client) {
  try {
    const auth = await decryptheader(header);
    const user_id = auth.user_id;
    console.log("user_id in authvalidation ", user_id);

    const isexist = await client.query(getUSerFromUserId, [
      user_id,
    ]);

    if (isexist.rowCount === 0) {
      logger.info("No  user exists");
      throw new Error("No  user exists");
    } else {
      return auth;
    }
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

export { decryptheader, authvalidation };
