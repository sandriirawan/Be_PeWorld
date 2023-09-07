-- Active: 1690780015370@@127.0.0.1@5432@peworld

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

CREATE TABLE
    perekrut (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        users_id VARCHAR NOT NULL,
        foto_pekerja VARCHAR(255),
        job_desk VARCHAR(255),
        deskripsi_singkat TEXT,
        tempat_kerja VARCHAR(255),
        provinsi VARCHAR(100),
        kota VARCHAR(100),
        instagram VARCHAR,
        github VARCHAR,
        linkedin VARCHAR
    );

ALTER TABLE pekerja ADD COLUMN email VARCHAR(100);

SELECT * FROM pekerja;

CREATE TABLE
    skill (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

CREATE TABLE
    Messages (
        id VARCHAR PRIMARY KEY,
        users_id_perekrut VARCHAR NOT NULL,
        users_id_pekerja VARCHAR NOT NULL,
        posisi VARCHAR(255) NOT NULL,
        message_detail TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (users_id_perekrut) REFERENCES Users (id),
        FOREIGN KEY (users_id_pekerja) REFERENCES Users (id)
    );

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE users;

CREATE FUNCTION UPDATE_UPDATED_ON_USERS() RETURNS TRIGGER 
AS $$ 
	$$ BEGIN NEW.updated_on = now();
	RETURN NEW;
	END;
	$$ language 'plpgsql';


CREATE TRIGGER UPDATE_USERS_UPDATED_ON 
	update_users_updated_on BEFORE
	UPDATE ON users FOR EACH ROW
	EXECUTE
	    PROCEDURE update_updated_on_users();


CREATE TABLE users_verification (
    id TEXT NOT NULL,
    users_id VARCHAR,
    token TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_users_verification_users
        FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);