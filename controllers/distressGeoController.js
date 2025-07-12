import pool from "../config/dbconfig.js";
import logger from "../utils/logger.js";
import { ulid } from "ulid";
import { authvalidation } from "../utils/auth.js";
import dotenv from "dotenv";
import {
  getDistressAndDistance,
  selectdistressrow,
} from "../queries/distressGeoLocationQueries.js";
import { sendLiveData } from "./websocket.js";

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
        data: {},
      });
      return;
    }
    const event = {
      latitude: latitude,
      longitude: longitude,
      project_id: project_id,
      distress_data: getList.rows,
    };
    sendLiveData(event);
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
const insertDistressSegment = async (req, res) => {
  const client = await pool.connect();
  const content = req.body;
  const currentTimestamp = 1751997804;

  try {
    logger.info("Entered into insertDistressSegment API");
    logger.info(content);
    if (!content) {
      throw new Error("Request body is empty");
    }
    // await authvalidation(req.headers, client);
    logger.info("User verified");

    const {
      start_latitude,
      start_longitude,
      end_latitude,
      end_longitude,
      start_chainage_m,
      end_chainage_m,
    } = content;
    // logger.info(start_latitude);
    // logger.info(end_latitude);
    // logger.info(start_longitude);

    // logger.info(end_longitude);
    // logger.info(start_chainage_m);
    // logger.info(end_chainage_m);

    if (
      !start_latitude ||
      !start_longitude ||
      !end_latitude ||
      !end_longitude ||
      !start_chainage_m ||
      !end_chainage_m
    ) {
      throw new Error(
        "Missing required fields: start_latitude, start_longitude, end_latitude, end_longitude, start_chainage_m, end_chainage_m"
      );
    }

    const id = ulid();
    const lane_id = "L1D1LHS";
    const length_m = parseFloat((end_chainage_m - start_chainage_m).toFixed(2));
    const prev_data = await client.query(selectdistressrow, [
      lane_id,
      start_chainage_m,
      end_chainage_m,
    ]);
    if (prev_data.rowCount > 0) {
      const updateDistressdata = await client.query(
        `
        UPDATE public.distress_segments
        SET
          start_chainage_m = $1,
          end_chainage_m = $2,
          length_m = $3,
          geom_start = ST_GeomFromText($4, 4326),
          geom_end = ST_GeomFromText($5, 4326),
          roughness_bi = $6,
          rut_depth_mm = $7,
          crack_area_pct = $8,
          ravelling_area_pct = $9,
          lane_id = $10,
          updarted_at = $11
        WHERE lane_id = $10 AND start_chainage_m = $1 AND end_chainage_m = $2
      `,
        [
          start_chainage_m,
          end_chainage_m,
          length_m,
          `POINT(${start_latitude} ${start_longitude})`,
          `POINT(${end_latitude} ${end_longitude})`,
          prev_data.rows[0].roughness_bi,
          prev_data.rows[0].rut_depth_mm,
          prev_data.rows[0].crack_area_pct,
          prev_data.rows[0].ravelling_area_pct,
          lane_id,
          currentTimestamp, // Use the same timestamp for update
        ]
      );
      logger.info({ count: updateDistressdata.rowCount });
    } else {
      // Generate random distress values
      const roughness_bi = parseFloat(
        (Math.random() * (7 - 0.5) + 0.5).toFixed(2)
      );
      const rut_depth_mm = parseFloat(
        (Math.random() * (20 - 1) + 1).toFixed(2)
      );
      const crack_area_pct = parseFloat(
        (Math.random() * (15 - 1) + 1).toFixed(2)
      );
      const ravelling_area_pct = parseFloat(
        (Math.random() * (15 - 0.1) + 0.1).toFixed(2)
      );

      // Construct the WKT point (geometry)
      const geom_start = `POINT(${start_latitude} ${start_longitude})`;
      const geom_end = `POINT(${end_latitude} ${end_longitude})`; // same for now

      const insertQuery = `
      INSERT INTO public.distress_segments (
        start_chainage_m, end_chainage_m, length_m, geom_start, geom_end,
        roughness_bi, rut_depth_mm, crack_area_pct, ravelling_area_pct,
        lane_id, id, created_at, updarted_at
      ) VALUES (
        $1, $2, $3, ST_GeomFromText($4, 4326), ST_GeomFromText($5, 4326),
        $6, $7, $8, $9,
        $10, $11, $12, $13
      )
    `;

      await client.query(insertQuery, [
        start_chainage_m,
        end_chainage_m,
        length_m,
        geom_start,
        geom_end,
        roughness_bi,
        rut_depth_mm,
        crack_area_pct,
        ravelling_area_pct,
        lane_id,
        id,
        currentTimestamp,
        currentTimestamp,
      ]);
    }
    res.status(200).send({
      status: 200,
      msg: `added distress segment successfully${start_chainage_m} to ${end_chainage_m}`,
      data: { id },
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
const getFullSegment = async (req, res) => {
  const client = await pool.connect();

  try {
    const project_id = req.query.project_id;
    const { rows } = await pool.query(getFullDistress, [project_id]);
    const formatted = rows.map((row) => ({
      segment_id: row.segment_id,
      lane_id: row.lane_id,
      lane_code: row.lane_code,
      side: row.side,
      chainage: {
        start: row.start_chainage_m,
        end: row.end_chainage_m,
        length: row.length_m,
      },
      path: [
        { lat: row.start_lat, lng: row.start_lng },
        { lat: row.end_lat, lng: row.end_lng },
      ],
      distress: {
        roughness: row.roughness_bi,
        rut: row.rut_depth_mm,
        crack: row.crack_area_pct,
        ravelling: row.ravelling_area_pct,
      },
    }));
    // res.json(formatted);
    res.status(200).send({
      status: 200,
      msg: "Data Returned Successfully",
      data: formatted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching project data" });
  }
};

export { getDistressData, insertDistressSegment, getFullSegment };
