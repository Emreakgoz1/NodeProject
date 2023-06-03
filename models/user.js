import { param } from "express-validator";
import pool from "../db.js";
import { sqlLogger } from "../utils/logger.js";

class User {
  //Tabloya yeni user ekleme kayıt sayfası
  static async create(data) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        "INSERT INTO users SET email = :email, username= :username, password = :password, avatar = :avatar",
        data
      );
      return result;
    } catch (e) {
      console.log("hata:", e);
      return;
    } finally {
      connection.release();
    }
  }
  //Id den user bulma
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      sqlLogger.info({
        query: "SELECT * FROM users WHERE id = :id",
        params: { id },
      });
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERe id = :id",
        { id }
      );
      return rows[0];
    } catch (e) {
      console.log("hata:", e);
      return;
    } finally {
      connection.release();
    }
  }
  static async findByUsername(username) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERe username = :username",
        { username }
      );
      return rows[0];
    } catch (e) {
      console.log("hata:", e);
      return;
    } finally {
      connection.release();
    }
  }
  //Email validation control
  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      sqlLogger.info({
        query: "SELECT * FROM users WHERE email = :email",
        params: { email },
      });
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE email = :email",
        { email }
      );
      return rows[0];
    } catch (e) {
      console.log("hata:", e);
      return;
    } finally {
      connection.release();
    }
  }
  static async login(username, password) {
    const connection = await pool.getConnection();
    try {
      sqlLogger.info({
        query:
          "SELECT * FROM users WHERE username = :username && password = :password",
        params: { username, password },
      });
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERe username = :username  && password = :password",
        { username, password }
      );
      return rows[0];
    } catch (e) {
      console.log("hata:", e);
      return;
    } finally {
      connection.release();
    }
  }
}

export default User;
