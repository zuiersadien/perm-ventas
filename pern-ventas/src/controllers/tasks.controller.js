const pool = require("../db");

const { faker } = require("@faker-js/faker");
const fs = require("fs");

async function generateUsers() {
  let users = [];

  for (let id = 1; id <= 100; id++) {
    const firsName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const matherName = faker.name.lastName();

    const code = +(Math.random() * 1000000).toFixed(0);
    const newTask = await pool.query(
      "INSERT INTO  prueba.trabajador (tra_nom, tra_pat,tra_mat, tra_cod ) VALUES($1, $2,$3,$4) RETURNING *",
      [firsName, lastName, matherName, code]
    );
  }
}

const createTask = async (req, res, next) => {
  try {
    const {  tra_cod, tra_nom, tra_pat, tra_mat, est_ado } = req.body;
    // generateUsers()
    const newTask = await pool.query(
      "INSERT INTO  prueba.trabajador (tra_nom, tra_pat,tra_mat, tra_cod ,est_ado) VALUES($1, $2,$3,$4,$5) RETURNING *",
      [tra_nom, tra_pat, tra_mat, tra_cod,est_ado]
    );

    res.json(newTask.rows[0]);
    res.json("solucionado");
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const allTasks = await pool.query("SELECT * FROM prueba.trabajador");

    res.json(allTasks.rows);
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM task WHERE id = $1", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {  tra_cod, tra_nom, tra_pat, tra_mat, est_ado } = req.body;

    const result = await pool.query(
      "UPDATE prueba.trabajador SET   tra_cod = $1 ,tra_nom = $2,tra_pat = $3 ,tra_mat = $4,est_ado = $5 WHERE tra_ide = $6  RETURNING *",
      [tra_cod, tra_nom,tra_pat,tra_mat,est_ado, id]

    );
    res.json(id);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    return res.json(result.rows[0]);
  } catch (error) {
    // next(error);
    console.log(error)
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM prueba.trabajador WHERE tra_ide = $1",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Task not found" });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
};
