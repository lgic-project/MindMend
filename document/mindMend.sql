-- -------------------------------------------------------------
-- TablePlus 5.3.6(496)
--
-- https://tableplus.com/
--
-- Database: mindMend
-- Generation Time: 2023-05-18 6:30:17.7890 PM
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."account";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS account_id_seq;

-- Table Definition
CREATE TABLE "public"."account" (
    "id" int4 NOT NULL DEFAULT nextval('account_id_seq'::regclass),
    "user_name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL,
    "is_active" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "user_id" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."account_profiles";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS account_profiles_id_seq;

-- Table Definition
CREATE TABLE "public"."account_profiles" (
    "id" int4 NOT NULL DEFAULT nextval('account_profiles_id_seq'::regclass),
    "account_id" int4 NOT NULL,
    "profile_id" int4 NOT NULL,
    "is_active" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."addresses";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS addresses_id_seq;

-- Table Definition
CREATE TABLE "public"."addresses" (
    "id" int4 NOT NULL DEFAULT nextval('addresses_id_seq'::regclass),
    "state" varchar(255) NOT NULL,
    "street" varchar(255) NOT NULL,
    "city" varchar(255) NOT NULL,
    "country" varchar(255) NOT NULL,
    "zip_code" varchar(255) NOT NULL,
    "is_active" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."api";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS api_api_id_seq;

-- Table Definition
CREATE TABLE "public"."api" (
    "api_id" int4 NOT NULL DEFAULT nextval('api_api_id_seq'::regclass),
    "api_path" varchar(100),
    "last_updated_by" varchar(32),
    "last_updated_date" timestamp,
    "method" varchar(20),
    "status" varchar(5),
    PRIMARY KEY ("api_id")
);

DROP TABLE IF EXISTS "public"."credentials";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS credentials_id_seq;

-- Table Definition
CREATE TABLE "public"."credentials" (
    "id" int4 NOT NULL DEFAULT nextval('credentials_id_seq'::regclass),
    "credentials_type" varchar(255) NOT NULL,
    "user_id" int4 NOT NULL,
    "k" varchar(255) NOT NULL,
    "e" varchar(255) NOT NULL,
    "v" varchar(255) NOT NULL,
    "is_active" varchar(255) NOT NULL DEFAULT 'Active'::character varying,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."discover";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS discover_id_seq;

-- Table Definition
CREATE TABLE "public"."discover" (
    "id" int4 NOT NULL DEFAULT nextval('discover_id_seq'::regclass),
    "title" varchar,
    "description" text,
    "image" varchar,
    "last_created_date" timestamp,
    "last_created_by" varchar,
    "status" varchar,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."doctor";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS doctor_id_seq;

-- Table Definition
CREATE TABLE "public"."doctor" (
    "id" int4 NOT NULL DEFAULT nextval('doctor_id_seq'::regclass),
    "doctor_name" varchar(250),
    "description" text,
    "phone" varchar(15),
    "status" varchar(50),
    "working_hours" int4,
    "working_day" varchar(100),
    "experience" varchar(100),
    "last_created_date" timestamp,
    "last_updated_by" varchar(150),
    "last_updated_date" timestamp,
    "doctor_category_id" int4,
    "image" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."doctor_address";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS doctor_address_id_seq;

-- Table Definition
CREATE TABLE "public"."doctor_address" (
    "id" int4 NOT NULL DEFAULT nextval('doctor_address_id_seq'::regclass),
    "doctor_id" int4,
    "address_id" int4,
    "status" varchar(50),
    "last_created_date" timestamp,
    "last_updated_date" timestamp,
    "last_updated_by" varchar(150),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."doctor_category";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS doctor_category_id_seq;

-- Table Definition
CREATE TABLE "public"."doctor_category" (
    "id" int4 NOT NULL DEFAULT nextval('doctor_category_id_seq'::regclass),
    "category_title" varchar(250),
    "status" varchar(50),
    "last_created_date" timestamp,
    "last_updated_date" timestamp,
    "last_updated_by" varchar(150),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."exercise";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS exercise_id_seq;

-- Table Definition
CREATE TABLE "public"."exercise" (
    "id" int4 NOT NULL DEFAULT nextval('exercise_id_seq'::regclass),
    "exercise_title" text,
    "description" text,
    "resource" text,
    "status" varchar(50),
    "last_created_date" timestamp,
    "last_updated_date" timestamp,
    "last_updated_by" varchar(150),
    "exercise_cat_id" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."exercise_category";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS exercise_category_id_seq;

-- Table Definition
CREATE TABLE "public"."exercise_category" (
    "id" int4 NOT NULL DEFAULT nextval('exercise_category_id_seq'::regclass),
    "title" varchar(250),
    "description" text,
    "status" varchar(50),
    "last_created_date" timestamp,
    "last_updated_date" timestamp,
    "last_updated_by" varchar(150),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."files";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS files_id_seq;

-- Table Definition
CREATE TABLE "public"."files" (
    "id" int4 NOT NULL DEFAULT nextval('files_id_seq'::regclass),
    "name" varchar(255) NOT NULL,
    "filelink" varchar(255) NOT NULL,
    "ext" varchar(255) NOT NULL,
    "status" varchar(255) NOT NULL DEFAULT 'Active'::character varying,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" varchar(255) DEFAULT NULL::character varying,
    "user_id" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."galleries";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS galleries_id_seq;

-- Table Definition
CREATE TABLE "public"."galleries" (
    "id" int4 NOT NULL DEFAULT nextval('galleries_id_seq'::regclass),
    "link" text,
    "status" varchar(255) DEFAULT NULL::character varying,
    "is_active" varchar(255) DEFAULT NULL::character varying,
    "user_id" int4,
    "created_at" timestamp,
    "deleted_at" timestamp,
    "name" varchar(255) DEFAULT NULL::character varying,
    "type" varchar(255) DEFAULT NULL::character varying,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."login_sessions";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS login_sessions_id_seq;

-- Table Definition
CREATE TABLE "public"."login_sessions" (
    "id" int4 NOT NULL DEFAULT nextval('login_sessions_id_seq'::regclass),
    "user_id" int4 NOT NULL,
    "k" varchar(255) NOT NULL,
    "v" varchar(255) NOT NULL,
    "remember_me" int4 NOT NULL,
    "is_active" varchar(255) NOT NULL,
    "cretaed_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."mood";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS mood_id_seq;

-- Table Definition
CREATE TABLE "public"."mood" (
    "id" int4 NOT NULL DEFAULT nextval('mood_id_seq'::regclass),
    "user_id" int4,
    "mood_id" int4,
    "last_created_date" timestamp,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."mood_category";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS mood_category_id_seq;

-- Table Definition
CREATE TABLE "public"."mood_category" (
    "id" int4 NOT NULL DEFAULT nextval('mood_category_id_seq'::regclass),
    "name" varchar(150),
    "logo" text,
    "status" varchar(50),
    "last_created_date" timestamp,
    "last_updated_date" timestamp,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."profile";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS profile_id_seq;

-- Table Definition
CREATE TABLE "public"."profile" (
    "id" int4 NOT NULL DEFAULT nextval('profile_id_seq'::regclass),
    "first_name" varchar(255) DEFAULT NULL::character varying,
    "middle_name" varchar(255) DEFAULT NULL::character varying,
    "last_name" varchar(255) DEFAULT NULL::character varying,
    "email" varchar(255) DEFAULT NULL::character varying,
    "email_verified" varchar(255) DEFAULT NULL::character varying,
    "is_active" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" int4,
    "role_id" int4,
    "image" varchar(250),
    "gender" varchar(50),
    "phone" varchar(15),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."profile_addresses";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS profile_addresses_id_seq;

-- Table Definition
CREATE TABLE "public"."profile_addresses" (
    "id" int4 NOT NULL DEFAULT nextval('profile_addresses_id_seq'::regclass),
    "address_id" int4 NOT NULL,
    "name" varchar(255) NOT NULL,
    "type" varchar(255) NOT NULL,
    "is_active" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_profile_id" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."siteconfig";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS siteconfig_id_seq;

-- Table Definition
CREATE TABLE "public"."siteconfig" (
    "id" int4 NOT NULL DEFAULT nextval('siteconfig_id_seq'::regclass),
    "name" varchar(255) NOT NULL,
    "site_key" varchar(255) NOT NULL,
    "site_value" text NOT NULL,
    "status" varchar(255) NOT NULL DEFAULT 'Active'::character varying,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."user";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_id_seq;

-- Table Definition
CREATE TABLE "public"."user" (
    "id" int4 NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    "email" varchar(50),
    "status" varchar(50),
    "last_created_date" timestamp,
    "last_updated_date" timestamp,
    "last_updated_by" varchar(150),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."workout";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS workout_id_seq;

-- Table Definition
CREATE TABLE "public"."workout" (
    "id" int4 NOT NULL DEFAULT nextval('workout_id_seq'::regclass),
    "title" text,
    "image" text,
    "cals" text,
    "timer" text,
    "status" varchar(50),
    "last_created_date" timestamp,
    "last_updated_date" timestamp,
    "last_updated_by" varchar(150),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."workout_exercise";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS workout_exercise_id_seq;

-- Table Definition
CREATE TABLE "public"."workout_exercise" (
    "id" int4 NOT NULL DEFAULT nextval('workout_exercise_id_seq'::regclass),
    "workout_id" int4,
    "exercise_id" int4,
    "status" varchar(50),
    "last_created_date" timestamp,
    "last_updated_date" timestamp,
    "last_updated_by" varchar(150),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."account" ("id", "user_name", "slug", "is_active", "created_at", "updated_at", "deleted_at", "user_id") VALUES
(1, 'sapna', 'sapna', '1', '2023-05-02 09:57:08.764283', '2023-05-02 09:57:08.764283', '2023-05-02 09:57:08.764283', 1),
(4, 'simranBaniya', 'simranBaniya', '1', '2023-05-02 10:14:16.645788', NULL, NULL, 1);

INSERT INTO "public"."account_profiles" ("id", "account_id", "profile_id", "is_active", "created_at", "deleted_at", "updated_at") VALUES
(1, 1, 1, '1', '2023-05-02 09:57:27.602427', '2023-05-02 09:57:27.602427', '2023-05-02 09:57:27.602427');

INSERT INTO "public"."addresses" ("id", "state", "street", "city", "country", "zip_code", "is_active", "created_at", "deleted_at", "updated_at") VALUES
(1, 'gandaki', 'nayabazar', 'pokhara', 'Nepal', '33700', '1', '2023-05-02 09:58:09.153845', '2023-05-02 09:58:09.153845', '2023-05-02 09:58:09.153845');

INSERT INTO "public"."doctor_category" ("id", "category_title", "status", "last_created_date", "last_updated_date", "last_updated_by") VALUES
(1, 'Dentist', '1', '2023-05-02 22:01:36.741209', '2023-05-02 16:18:55.476366', 'Simran');

INSERT INTO "public"."mood" ("id", "user_id", "mood_id", "last_created_date") VALUES
(1, 1, 1, '2023-05-09 17:41:47.770094');

INSERT INTO "public"."mood_category" ("id", "name", "logo", "status", "last_created_date", "last_updated_date") VALUES
(1, 'Happy', NULL, '1', '2023-05-09 18:03:18.509281', '2023-05-09 18:03:18.509281');

INSERT INTO "public"."profile" ("id", "first_name", "middle_name", "last_name", "email", "email_verified", "is_active", "created_at", "deleted_at", "updated_at", "user_id", "role_id", "image", "gender", "phone") VALUES
(1, 'sapna', NULL, 'baniya', 'sapna@gmail.com', 'true', '1', '2023-04-30 16:37:16.094639', '2023-04-30 16:37:16.094639', '2023-04-30 16:37:16.094639', 1, 1, NULL, 'female', '981111111');

INSERT INTO "public"."profile_addresses" ("id", "address_id", "name", "type", "is_active", "created_at", "updated_at", "deleted_at", "account_profile_id") VALUES
(1, 1, 'address', 'temporary', '1', '2023-05-02 09:58:54.648372', '2023-05-02 09:58:54.648372', '2023-05-02 09:58:54.648372', 1);

INSERT INTO "public"."siteconfig" ("id", "name", "site_key", "site_value", "status", "created_at", "updated_at", "user_id") VALUES
(1, 'walkthrough', 'walkthrough 1', 'Express your thoughts and feel the pleasure', '1', '2023-04-30 21:10:34.941739', '2023-04-30 16:33:42.522675', NULL),
(3, 'walkthrough', 'walkthrough 2', 'Find the find doctors for you', '1', '2023-04-30 16:24:37.243087', '2023-04-30 16:24:37.243089', NULL);

INSERT INTO "public"."user" ("id", "email", "status", "last_created_date", "last_updated_date", "last_updated_by") VALUES
(1, 'sapna@gmail.com', '1', '2023-04-30 16:35:48.806532', '2023-04-30 16:35:48.806532', 'Admin');

