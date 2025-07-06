import pool from "../config/dbconfig.js";
import express from "express";
import logger from "../utils/logger.js";
import bcrypt from "bcrypt";
import * as queriesuserauth from "../queries/userauth.js";
import jwt from "jsonwebtoken";
import { ulid } from "ulid";
import { authvalidation } from "../utils/auth.js";
import dotenv from "dotenv";

dotenv.config();

import { insertUser, getUserFromUsername } from "../queries/userauth.js";

const roList = async (req, res) => {
  const client = await pool.connect();
  const currentTimestamp = Date.now();
  const content = req.body;
  try {
    const id = ulid();
    logger.info("enter into roList");
    logger.info(content);

    await client.query("BEGIN");

    const adduser = await client.query(insertUser, [
      id,
      content.username,
      hashpass,
      content.name,
      content.email,
      content.phone,
      content.role,
      content.status,
      currentTimestamp,
      currentTimestamp,
    ]);

    if (adduser.rowCount > 0) {
      logger.info("user added successfully");
    } else {
      throw new Error("Error occurred");
    }

    await client.query("COMMIT");

    res.status(200).send({
      status: 200,
      msg: "Data Returned Successfully",
      Data: req.body,
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
  try {
    const content = req.body;
    const username = content.username;

    let data = await client.query(getUserFromUsername, [username]);

    if (data.rowCount === 0) throw new Error("Invalid Username");

    data = data.rows[0];

    const match = await bcrypt.compare(content.password, data.hashpass);
    if (!match) throw new Error("Incorrect Password");

    const currentTimeUTC = Date.now();
    const expirationTimeUTC = currentTimeUTC + 7 * 24 * 60 * 60 * 1000; // 7 days

    const expirationTimeEpoch = expirationTimeUTC;
    const token = jwt.sign(
      {
        user_id: data.id,
        username: data.username,
      },
      process.env.JWT_SECRET
    );

    const result = {
      loggedIn: data.status,
      user_id: data.id,
      name: data.name,
      token,
      exp: expirationTimeEpoch,
    };

    res.status(200).send({
      status: 200,
      msg: "Data Returned Successfully",
      Data: result,
    });
  } catch (error) {
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

const ProjectList = async (req, res) => {
  const client = await pool.connect();
  try {
    const auth = await authvalidation(req.headers, client);
    const user_id = auth.user_id;

    await client.query("BEGIN");
    const content = req.body;
    const id = req.params.id;
    const currentTimestamp = Date.now();

    const updateUser = await client.query(queriesuserauth.editUser, [
      id,
      content.username,
      content.name,
      content.email,
      content.phone,
      content.warehouse,
      currentTimestamp,
      content.status,
    ]);

    if (updateUser.rowCount > 0) {
      logger.info("user updated Successfully");
    } else {
      logger.warn("user update failed");
      throw new Error("No user updated");
    }

    await client.query("COMMIT");

    res.status(200).send({
      status: 200,
      msg: "User Edit Successfully",
      Data: req.body,
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

export { login, signup, editUser, getusercustomer };
