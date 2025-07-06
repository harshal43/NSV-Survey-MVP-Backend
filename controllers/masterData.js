import pool from "../config/dbconfig.js";
import express from "express";
import logger from "../utils/logger.js";
import { ulid } from "ulid";
import { authvalidation } from "../utils/auth.js";
import dotenv from "dotenv";
import {
  getLaneData,
  getPiuList,
  getProjectList,
  getRoList,
} from "../queries/masterDataQueries.js";

dotenv.config();

const roList = async (req, res) => {
  const client = await pool.connect();
  const currentTimestamp = Date.now();
  const content = req.body;
  try {
    logger.info("enter into roList");
    logger.info(content);

    await authvalidation(req.headers, client);

    logger.info("user verified");

    const getList = await client.query(getRoList);

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
const PiuList = async (req, res) => {
  const client = await pool.connect();
  const currentTimestamp = Date.now();
  const content = req.body;
  try {
    const id = ulid();
    logger.info("enter into roList");
    logger.info(content);
    const ro_id = req.query.ro_id;
    if (ro_id == null) {
      throw new Error("ro_id is mandatory");
    }
    await authvalidation(req.headers, client);

    logger.info("user verified");

    const getList = await client.query(getPiuList, [ro_id]);

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
const ProjectList = async (req, res) => {
  const client = await pool.connect();
  const currentTimestamp = Date.now();
  const content = req.body;
  try {
    logger.info("enter into project List");
    logger.info(content);
    const piu_id = req.query.piu_id;
    await authvalidation(req.headers, client);

    logger.info("user verified");

    const getList = await client.query(getProjectList, [piu_id]);

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
const laneData = async (req, res) => {
  const client = await pool.connect();
  const currentTimestamp = Date.now();
  const content = req.body;
  try {
    logger.info("enter into project List");
    logger.info(content);
    const project_id = req.query.project_id;
    await authvalidation(req.headers, client);

    logger.info("user verified");

    const getList = await client.query(getLaneData, [project_id]);

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

export { roList, PiuList, ProjectList,laneData };
