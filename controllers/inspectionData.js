import pool from "../config/dbconfig.js";
import logger from "../utils/logger.js";
import { ulid } from "ulid";
import { authvalidation } from "../utils/auth.js";
import dotenv from "dotenv";
import {
  addInspectionQuery,
  projectInspection,
} from "../queries/inspectionQueries.js";

dotenv.config();

const inspectionData = async (req, res) => {
  const client = await pool.connect();
  const currentTimestamp = Date.now();
  const content = req.body;
  try {
    logger.info("enter into inspectionDataApi");
    logger.info(content);
    const project_id = req.query.project_id;

    await authvalidation(req.headers, client);

    logger.info("user verified");

    const getList = await client.query(projectInspection, [project_id]);
    if (getList.rowCount == 0) {
      res.status(200).send({
        status: 200,
        msg: "No Record Found",
        data: getList.rows,
      });
      return;
    }
    res.status(200).send({
      status: 200,
      msg: "Data Returned Successfully",
      data: getList.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(error);
    res.status(400).send({
      status: 400,
      msg: error.message,
      data: req.body,
    });
  } finally {
    client.release();
  }
};
const addInspection = async (req, res) => {
  const client = await pool.connect();
  const currentTimestamp = Date.now();
  const content = req.body;
  try {
    logger.info("enter into inspectionDataApi");
    logger.info(content);
    const project_id = req.query.project_id;
    const currentTimestamp = Date.now();
    const auth = await authvalidation(req.headers, client);
    const user_id = auth.user_id;
    const id = ulid();
    logger.info("user verified");

    await client.query(addInspectionQuery, [
      id,
      project_id,
      content.inspection_date,
      content.remarks,
      user_id,
      content.duration,
      content.video_link,
      currentTimestamp,
    ]);

    res.status(200).send({
      status: 200,
      msg: "Inspection Completed Successfully",
      data: req.body,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(error);
    res.status(400).send({
      status: 400,
      msg: error.message,
      data: req.body,
    });
  } finally {
    client.release();
  }
};

export { inspectionData, addInspection };
