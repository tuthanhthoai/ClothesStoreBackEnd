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
      const newCategory = await Category.create({ name });
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

const updateCategory = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(id);
      if (checkCategory === null) {
        resolve({
          status: "ERR",
          message: "The category is not existed!",
        });
      }
      const updatedCategory = await Category.findByIdAndUpdate(id, {name:data.name}, { new: true });
      if (updatedCategory) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: updatedCategory,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(id);
      if (checkCategory === null) {
        resolve({
          status: "ERR",
          message: "The category is not existed!",
        });
      }
      await Category.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategories = await Category.find().sort({createdAt: -1, updatedAt: -1});
      resolve({
        status: "OK",
        message: "Success",
        data: allCategories,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailCategory = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategories = await Category.findById(categoryId);
      resolve({
        status: "OK",
        message: "Success",
        data: allCategories,
      });
    } catch (e) {
      reject(e);
    }
  });
};


const deleteManyCategory = (ids) => {
  return new Promise(async (resolve, reject) => {
      try {
          await Category.deleteMany({ _id: ids })
          resolve({
              status: 'OK',
              message: 'Delete category successfully!',
          })
      } catch (e) {
          reject(e)
      }
  })
}

module.exports = { createCategory, updateCategory, deleteCategory, getAllCategory, getDetailCategory, deleteManyCategory };
