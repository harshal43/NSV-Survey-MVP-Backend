const getDistress = `WITH nearest_segment AS (
  SELECT 
    ds.start_chainage_m,
    ds.end_chainage_m,
    LEAST(
      ST_Distance(ds.geom_start::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography),
      ST_Distance(ds.geom_end::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography)
    ) AS distance_meters
  FROM distress_segments ds
  JOIN lanes l ON ds.lane_id = l.id
  WHERE l.project_id = $1
  AND (
    ST_DWithin(ds.geom_start::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, 150) OR
    ST_DWithin(ds.geom_end::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, 150)
  )
  ORDER BY distance_meters
  LIMIT 1
)

SELECT 
  ds.id AS distress_segment_id,
  l.lane_code,
  ds.start_chainage_m,
  ds.end_chainage_m,
  ds.roughness_bi,
  ds.rut_depth_mm,
  ds.crack_area_pct,
  ds.ravelling_area_pct,
  ns.distance_meters
FROM distress_segments ds
JOIN lanes l ON ds.lane_id = l.id
JOIN nearest_segment ns ON 
  ds.start_chainage_m = ns.start_chainage_m AND 
  ds.end_chainage_m = ns.end_chainage_m
WHERE l.project_id = $1`;

const getDistressAndDistance = `WITH nearest_segment AS (
  SELECT 
    ds.start_chainage_m,
    ds.end_chainage_m,
    LEAST(
      ST_Distance(
        ds.geom_start::geography,
        ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography
      ),
      ST_Distance(
        ds.geom_end::geography,
        ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography
      )
    ) AS distance_meters
  FROM distress_segments ds
  JOIN lanes l ON ds.lane_id = l.id
  WHERE l.project_id = $1
    AND (
      ST_DWithin(ds.geom_start::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, 1500000)
      OR
      ST_DWithin(ds.geom_end::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, 1500000)
    )
  ORDER BY distance_meters
  LIMIT 1
)

SELECT 
  ds.id AS distress_segment_id,
  l.lane_code,
  l.side,
  ds.start_chainage_m,
  ds.end_chainage_m,
  ds.roughness_bi,
  ds.rut_depth_mm,
  ds.crack_area_pct,
  ds.ravelling_area_pct,
  ns.distance_meters
FROM distress_segments ds
JOIN lanes l ON ds.lane_id = l.id
JOIN nearest_segment ns 
  ON ds.start_chainage_m = ns.start_chainage_m 
  AND ds.end_chainage_m = ns.end_chainage_m
WHERE l.project_id = $1;
`;

const selectdistressrow = `SELECT start_chainage_m, end_chainage_m, length_m, geom_start, geom_end, roughness_bi, rut_depth_mm, crack_area_pct, ravelling_area_pct, lane_id, id, created_at, updarted_at
	FROM public.distress_segments WHERE lane_id = $1 AND start_chainage_m = $2 AND end_chainage_m = $3;`;
const getFullDistress = `
  SELECT 
  ds.id AS segment_id,
  ds.lane_id,
  l.lane_code,
  l.side,
  ds.start_chainage_m,
  ds.end_chainage_m,
  ds.length_m,
  ST_Y(ds.geom_start::geometry) AS start_lat,
  ST_X(ds.geom_start::geometry) AS start_lng,
  ST_Y(ds.geom_end::geometry) AS end_lat,
  ST_X(ds.geom_end::geometry) AS end_lng,
  ds.roughness_bi,
  ds.rut_depth_mm,
  ds.crack_area_pct,
  ds.ravelling_area_pct
FROM 
  distress_segments ds
JOIN 
  lanes l ON ds.lane_id = l.id
WHERE 
  l.project_id = $1
 ORDER BY  lane_code, start_chainage_m`;

const getFullLaneWiseDistress = `SELECT 
  l.lane_code,
  l.side,
  json_agg(
    json_build_object(
      'segment_id', ds.id,
      'chainage', json_build_object(
        'start', ds.start_chainage_m,
        'end', ds.end_chainage_m,
        'length', ds.length_m
      ),
      'path', json_build_array(
        json_build_object('start_lat', ST_Y(ds.geom_start::geometry), 'strt_lng', ST_X(ds.geom_start::geometry)),
        json_build_object('end_lat', ST_Y(ds.geom_end::geometry), 'end_lng', ST_X(ds.geom_end::geometry))
      ),
      'distress', json_build_object(
        'roughness', ds.roughness_bi,
        'rut', ds.rut_depth_mm,
        'crack', ds.crack_area_pct,
        'ravelling', ds.ravelling_area_pct
      )
    )
    ORDER BY ds.start_chainage_m
  ) AS segments
FROM 
  distress_segments ds
JOIN 
  lanes l ON ds.lane_id = l.id
WHERE 
  l.project_id = $1
GROUP BY 
  l.lane_code, l.side
ORDER BY 
  l.lane_code;
`;

const start_end_lat_long = `SELECT 
  ST_X((SELECT geom_start::geometry FROM distress_segments ds
        JOIN lanes l ON ds.lane_id = l.id
        WHERE l.project_id = $1
        ORDER BY ds.start_chainage_m ASC
        LIMIT 1)) AS start_lat,

  ST_Y((SELECT geom_start::geometry FROM distress_segments ds
        JOIN lanes l ON ds.lane_id = l.id
        WHERE l.project_id = $1
        ORDER BY ds.start_chainage_m ASC
        LIMIT 1)) AS start_long,

  ST_X((SELECT geom_end::geometry FROM distress_segments ds
        JOIN lanes l ON ds.lane_id = l.id
        WHERE l.project_id = $1
        ORDER BY ds.end_chainage_m DESC
        LIMIT 1)) AS end_lat,

  ST_Y((SELECT geom_end::geometry FROM distress_segments ds
        JOIN lanes l ON ds.lane_id = l.id
        WHERE l.project_id = $1
        ORDER BY ds.end_chainage_m DESC
        LIMIT 1)) AS end_long,

  (SELECT start_chainage_m FROM distress_segments ds
   JOIN lanes l ON ds.lane_id = l.id
   WHERE l.project_id = $1
   ORDER BY ds.start_chainage_m ASC
   LIMIT 1) AS start_chainage_m,

  (SELECT end_chainage_m FROM distress_segments ds
   JOIN lanes l ON ds.lane_id = l.id
   WHERE l.project_id = $1
   ORDER BY ds.end_chainage_m DESC
   LIMIT 1) AS end_chainage_m;
`;
export {
  getDistress,
  getDistressAndDistance,
  selectdistressrow,
  getFullDistress,
  getFullLaneWiseDistress,
  start_end_lat_long
};
