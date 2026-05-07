const express = require("express");
const ClientRouter = express.Router();
const {
  createClient,
  
  getClient,
  getClientById,
  updateClient,
  deleteClients
  
 
} = require("../controllers/clientController");


ClientRouter.post("/create", createClient);


ClientRouter.get("/get", getClient);



ClientRouter.get("/getById/:id", getClientById);

ClientRouter.patch("/update/:_id", updateClient);


ClientRouter.delete("/delete/:_id", deleteClients);

module.exports = ClientRouter;
