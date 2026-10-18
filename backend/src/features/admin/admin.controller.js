const adminService = require('./admin.service');

const getMembers = async (req, res, next) => {
  try {
    const result = await adminService.getAdminMembers(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMemberById = async (req, res, next) => {
  try {
    const member = await adminService.getMemberDetails(req.params.id);
    return res.status(200).json({ member, data: member, ...member });
  } catch (error) {
    next(error);
  }
};

const createMember = async (req, res, next) => {
  try {
    const newMember = await adminService.createMember(req.body);
    return res.status(201).json({
      message: 'Member created successfully',
      member: newMember,
    });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        message: error.message,
        field: error.field,
      });
    }
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const updated = await adminService.updateMember(req.params.id, req.body, req.user);
    return res.status(200).json({
      message: 'Member updated successfully',
      member: updated,
    });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        message: error.message,
        field: error.field,
      });
    }
    next(error);
  }
};

const deactivateMember = async (req, res, next) => {
  try {
    const result = await adminService.deactivateMember(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return res.status(200).json({ data: stats, ...stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deactivateMember,
  getDashboard,
};
