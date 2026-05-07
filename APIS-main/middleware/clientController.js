const Client = require("../models/client");

// ✅ Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required." });
    }

    const newClient = new Client({ name, location });
    await newClient.save();

    res.status(201).json({ message: "Client created successfully", client: newClient });
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error: error.message });
  }
};

// ✅ Get all clients
exports.getClient = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error: error.message });
  }
};

// ✅ Get client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error fetching client", error: error.message });
  }
};

// ✅ Update client
exports.updateClient = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, location } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      _id,
      { name, location },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client updated successfully", client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error: error.message });
  }
};

exports.deleteClients = async (req,res) => {
  const { _id } = req.params;

  try {
    const Clients = await Client.findByIdAndRemove(_id);

    if (!Clients) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json({ success: true, message: 'Client deleted successfully', data: Clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete Client', error: error.message });
  }
}
