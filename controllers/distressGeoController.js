import pool from "../config/dbconfig.js";
import logger from "../utils/logger.js";
import { ulid } from "ulid";
import { authvalidation } from "../utils/auth.js";
import dotenv from "dotenv";
import { getDistressAndDistance } from "../queries/distressGeoLocationQueries.js";

dotenv.config();

const getDistressData = async (req, res) => {
  const client = await pool.connect();
  const currentTimestamp = Date.now();
  const content = req.body;
  try {
    logger.info("enter into roList");
    logger.info(content);

    await authvalidation(req.headers, client);
    logger.info("user verified");

    if (!content.latitude || !content.longitude || !content.project_id) {
      throw new Error("Missing lat long or project not selected");
    }
    const project_id = content.project_id;
    const latitude = content.latitude;
    const longitude = content.longitude;

    const getList = await client.query(getDistressAndDistance, [
      project_id,
      latitude,
      longitude,
    ]);
    if (getList.rowCount == 0) {
      res.status(304).send({
        status: 304,
        msg: "no data found for this lat long",
        Data: {},
      });
    }
    res.status(200).send({
      status: 200,
      msg: "Data Returned Successfully",
      Data: getList.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(error);
    res.status(400).send({
      status: 400,
      msg: error.message,
      Data: req.body,
    });
  } finally {
    client.release();
  }
};

export { getDistressData };
