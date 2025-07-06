CREATE TABLE public."user"
(
    id character varying NOT NULL,
    username character varying,
    hashpass character varying,
    name character varying,
    email character varying,
    phone character varying,
    role character varying,
    status boolean,
    created_at bigint,
    updated_at bigint,
    PRIMARY KEY (id)
);

CREATE TABLE public.ro_master
(
    id character varying NOT NULL,
    ro_name character varying NOT NULL,
    ro_resp character varying,
    email character varying,
    phone character varying,
    state character varying,
    address character varying,
    pincode character varying,
    created_at bigint,
    updated_at bigint,
    PRIMARY KEY (id)
);

CREATE TABLE public.piu_master
(
    id character varying NOT NULL,
    piu_name character varying,
    address character varying,
    email character varying,
    phone character varying,
    pd_name character varying,
    pincode character varying,
    created_at bigint,
    updated_at bigint,
    PRIMARY KEY (id)
);



-- DROP TABLE IF EXISTS public.distress_limits;

CREATE TABLE IF NOT EXISTS public.distress_limits
(
    id integer NOT NULL DEFAULT nextval('distress_limits_id_seq'::regclass),
    project_id integer,
    roughness_limit numeric,
    rutting_limit numeric,
    cracking_limit numeric,
    ravelling_limit numeric,
    CONSTRAINT distress_limits_pkey PRIMARY KEY (id),
    CONSTRAINT distress_limits_project_id_fkey FOREIGN KEY (project_id)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.distress_limits
    OWNER to postgres;