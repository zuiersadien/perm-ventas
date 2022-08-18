const pool = require("../db");

const { faker } = require("@faker-js/faker");
const fs = require("fs");
const { request } = require("https");

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
  console.log("gola")
  try {
    const {
      ven_ser,
      ven_num,
      ven_cli,
      ven_mon,
      v_d_pro,
      v_d_uni,
      v_d_can,
      v_d_tot,
      est_ado,
    } = req.body;

    const newVenta = await pool.query(
      "INSERT INTO  prueba.venta (ven_ser, ven_num,ven_cli, ven_mon ) VALUES($1, $2,$3,$4) RETURNING *",
      [ ven_ser,ven_num, ven_cli, ven_mon]
    );
    const nuewVentaDetalle = await pool.query(
      "INSERT INTO  prueba.venta_detalle (v_d_pro, v_d_uni,v_d_can, v_d_tot,est_ado ) VALUES($1, $2,$3,$4,$5) RETURNING *",
      [v_d_pro, v_d_uni, v_d_can, v_d_tot ,1]
    );
     
    res.json(nuewVentaDetalle.rows[0],);
    // res.json("solucionado");
  } catch (error) {
    console.log(error)
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const allTasks = await pool.query("SELECT * FROM prueba.venta");
    const nuewVentaDetalle = await pool.query("SELECT * FROM prueba.venta_detalle");

    const name = allTasks.rows.map((e,i)=>{
      return Object.assign({}, e, nuewVentaDetalle.rows[i]);
    })
    console.log(name)
    res.json(name);
  } catch (error) {
    next(error);
  }
};
const Detalles = async (req, res, next) => {
  try {
    const allTasks = await pool.query("SELECT * FROM prueba.venta_detalle");
    const nuewVentaDetalle = await pool.query("SELECT * FROM prueba.venta_detalle");

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
    const { v_d_pro, ven_cli, ven_mon, v_d_uni, v_d_can,v_d_tot,est_ado } = req.body;

    const result = await pool.query(
      "UPDATE prueba.venta SET   ven_cli = $1 ,ven_mon = $2  WHERE ven_ide = $3  RETURNING *",
      [ven_cli, ven_mon, id]
    );
    const result_detail = await pool.query(
      "UPDATE prueba.venta_detalle SET   v_d_pro = $1 ,v_d_uni = $2,v_d_can = $3 ,v_d_tot = $4 est_ado=$5  WHERE v_d_ide = $6 ,RETURNING *",
      [v_d_pro, v_d_uni, v_d_can, v_d_tot,1, id]
    );

    res.json(id);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    return res.json(result.rows[0]);
  } catch (error) {
    // next(error);
    console.log(error);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "DELETE FROM prueba.venta WHERE ven_ide = $1",
      [id]
    );
    const resultDetail = await pool.query(
      "DELETE FROM prueba.venta_detalle WHERE v_d_ide = $1",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Task not found" });
      
      res.json('true')
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
  Detalles
};
