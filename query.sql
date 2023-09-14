-- Active: 1694109783523@@147.139.210.135@5432@sandri03

CREATE TABLE
    users (
        id VARCHAR PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        confirmpassword VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        jabatan VARCHAR(255),
        role VARCHAR(20) NOT NULL,
        verify text not null,
        updated_on timestamp default CURRENT_TIMESTAMP not null
    );

--  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

CREATE TABLE
    perekrut (
        id VARCHAR PRIMARY KEY,
        users_id VARCHAR NOT NULL,
        foto_perusahaan VARCHAR(255),
        nama_perusahaan VARCHAR(255),
        bidang_perusahaan VARCHAR(255),
        provinsi VARCHAR(100),
        kota VARCHAR(100),
        info_perusahaan TEXT,
        email_perusahaan VARCHAR(255),
        phone_perusahaan VARCHAR(20),
        linkedin VARCHAR(255)
    );

CREATE TABLE
    pekerja (
        id VARCHAR PRIMARY KEY,
        users_id VARCHAR NOT NULL,
        foto_pekerja VARCHAR(255),
        job_desk VARCHAR(255),
        deskripsi_singkat TEXT,
        tempat_kerja VARCHAR(255),
        provinsi VARCHAR(100),
        kota VARCHAR(100),
        email VARCHAR(100),
        instagram VARCHAR,
        github VARCHAR,
        linkedin VARCHAR
    );

ALTER TABLE pekerja ADD COLUMN email VARCHAR(100);

SELECT * FROM pekerja;

CREATE TABLE
    skill (
        id VARCHAR PRIMARY KEY,
        users_id VARCHAR NOT NULL,
        nama_skill VARCHAR
    );

CREATE TABLE
    pengalaman (
        id VARCHAR PRIMARY KEY,
        users_id VARCHAR NOT NULL,
        posisi VARCHAR(255) NOT NULL,
        nama_perusahaan VARCHAR(255) NOT NULL,
        foto_perusahaan VARCHAR(255),
        tahun_masuk TIMESTAMP NOT NULL,
        tahun_keluar TIMESTAMP NOT NULL,
        deskripsi TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    portofolio (
        id VARCHAR PRIMARY KEY,
        users_id VARCHAR NOT NULL,
        nama_aplikasi VARCHAR(255) NOT NULL,
        link_repo VARCHAR(255) NOT NULL,
        tipe VARCHAR(100) NOT NULL,
        photo VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE FUNCTION UPDATE_UPDATED_ON_USERS() RETURNS TRIGGER 
AS $$ 
	$$ $$ BEGIN NEW.updated_on = NOW();


RETURN NEW;

END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER UPDATE_USERS_UPDATED_ON 
	UPDATE_USERS_UPDATED_ON update_users_updated_on BEFORE
	UPDATE ON users FOR EACH ROW
	EXECUTE
	    FUNCTION update_updated_on_users();


CREATE TABLE
    users_verification (
        id TEXT NOT NULL,
        users_id VARCHAR,
        token TEXT,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT fk_users_verification_users FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (id)
    );

CREATE TABLE
    hire (
        id VARCHAR PRIMARY KEY,
        title VARCHAR NOT NULL,
        desciption TEXT,
        pekerja_id VARCHAR(255) NOT NULL,
        perekrut_id VARCHAR(255) NOT NULL,
        pekerja_name VARCHAR(255) NOT NULL,
        pekerja_email VARCHAR(255) NOT NULL,
        perekrut_compname VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE hire;
