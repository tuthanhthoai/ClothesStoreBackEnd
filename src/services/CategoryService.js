const Category = require("../models/Category");

const createCategory = (newCategory) => {
  return new Promise(async (resolve, reject) => {
    const { name } = newCategory;
    try {
      const checkCategory = await Category.findOne({
        name: name,
      });
      if (checkCategory !== null) {
        resolve({
          status: "ERR",
          message: "The name of category is existed!",
        });
      }
      const newCategory = await Category.create({name});
      if (newCategory) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newCategory,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {createCategory}