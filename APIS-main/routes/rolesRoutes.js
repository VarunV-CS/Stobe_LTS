const express = require("express");
const RolesRouter = express.Router();

const {
  createRoles,
  getActiveRoles,
  getRoles,
  getRolesById,
  updateRoles,
  deleteRoles

} = require("../controllers/rolesController");
const authMiddleware = require("../middleware/auth");

RolesRouter.post("/create", createRoles);


RolesRouter.get("/get", getRoles);

RolesRouter.get("/getActiveRoles", getActiveRoles);


RolesRouter.get("/getById/:id", getRolesById);

RolesRouter.patch("/update/:_id", updateRoles);


RolesRouter.delete("/delete/:_id", deleteRoles);


module.exports = RolesRouter;
