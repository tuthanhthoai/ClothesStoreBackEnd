const CategoryService = require("../services/CategoryService");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required!",
      });
    }
    const response = await CategoryService.createCategory(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = { createCategory };
