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
      ST_DWithin(ds.geom_start::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, 1500)
      OR
      ST_DWithin(ds.geom_end::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, 1500)
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
JOIN nearest_segment ns 
  ON ds.start_chainage_m = ns.start_chainage_m 
  AND ds.end_chainage_m = ns.end_chainage_m
WHERE l.project_id = $1;
`;
export { getDistress,getDistressAndDistance };
