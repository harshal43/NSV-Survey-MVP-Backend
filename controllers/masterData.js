import pool from "../config/dbconfig.js";
import express from "express";
import logger from "../utils/logger.js";
import { ulid } from "ulid";
import { authvalidation } from "../utils/auth.js";
import dotenv from "dotenv";
import {
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
      Data: getList.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(error);
    res.status(400).send({
      status: 400,
      msg: error.message,
      Data: { user_id: id },
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
    await authvalidation(req.headers, client);

    logger.info("user verified");

    const getList = await client.query(getPiuList, { ro_id });

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
      Data: { user_id: id },
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

    const getList = await client.query(getProjectList, { piu_id });

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
      Data: { user_id: id },
    });
  } finally {
    client.release();
  }
};

const getusercustomer = async (req, res) => {
  const client = await pool.connect();
  try {
    const auth = await authvalidation(req.headers, client);
    const user_id = auth.user_id;

    let { limit, offset } = req.query;
    offset = (offset - 1) * limit;
    const oms_user = req.query.oms_user;

    const customer_count = await client.query(
      queriesCustomer.customerCountActive
    );
    const total_customer_count = customer_count.rows[0].total_customer_count;
    const total_pages = Math.ceil(total_customer_count / limit);

    const customer_list = await client.query(queriesCustomer.getusercustomer, [
      oms_user,
      limit,
      offset,
    ]);
    const result = customer_list.rows;

    res.status(200).send({
      status: 200,
      msg: "Data Returned Successfully",
      data: {
        total_pages,
        total_customer: total_customer_count,
        customer_list: result,
      },
    });
  } catch (error) {
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

export { roList, PiuList, ProjectList };
