const { start } = require("repl");
const Role = require("../models/roles");

// ✅ Create a new role
exports.createRoles = async (req, res) => {
  try {
    const { roleName, requiredExperience, clientId, location, techStack ,startDate,endDate,status} = req.body;

    if (!roleName || !requiredExperience || !Array.isArray(clientId) || clientId.length === 0 || !location || !techStack) {
      return res.status(400).json({ message: "All fields are required, including at least one client." });
    }

    const newRole = new Role({ roleName, requiredExperience, clientId, location, techStack ,startDate,endDate,status});
    await newRole.save();

    res.status(201).json({ message: "Role created successfully", role: newRole });
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error: error.message });
  }
};


// ✅ Get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("clientId", "name location");
// Fetch client details
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error: error.message });
  }
};

exports.getActiveRoles = async (req, res) => {
  try {
    const roles = await Role.find({ status: "Active" }).populate("clientId", "name location");
// Fetch client details
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error: error.message });
  }
};

// ✅ Get role by ID
exports.getRolesById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id).populate("clientId", "name location");

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Error fetching role", error: error.message });
  }
};

// ✅ Update role
exports.updateRoles = async (req, res) => {
  try {
    const { _id } = req.params;
    const { roleName, requiredExperience, clientId, location, techStack } = req.body;

    if (!roleName || !requiredExperience || !Array.isArray(clientId) || clientId.length === 0 || !location || !techStack) {
      return res.status(400).json({ message: "All fields are required, including at least one client." });
    }

    const updatedRole = await Role.findByIdAndUpdate(
      _id,
      { roleName, requiredExperience, clientId, location, techStack },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
};


exports.deleteRoles = async (req,res) => {
  const { _id } = req.params;

  try {
    const Roles = await Role.findByIdAndRemove(_id);

    if (!Roles) {
      return res.status(404).json({ success: false, message: 'role not found' });
    }

    res.status(200).json({ success: true, message: 'role deleted successfully', data: Roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete role', error: error.message });
  }
}