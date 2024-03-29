const fs = require('fs').promises;
const path = require('path');

const { generateBarcode } = require('../utils/barcodeGenerator');
const { generateId } = require('../utils/idGenerator');
const { JSONFileManager } = require('../utils/jsonFileManager');

const dataFileManager = new JSONFileManager(path.resolve('data/data.json'));

const getAllProduct = async (req, res, next) => {
  try {
    await dataFileManager.checkAndCreateDir();
    const allData = await dataFileManager.readAllData();
    res.send({ products: allData, error: false });
  } catch (err) {
    const error = new Error('Something went wrong! :(.');
    error.status = 500;
    next(error);
  }
};

const postProduct = async (req, res, next) => {
  try {
    await dataFileManager.checkAndCreateDir();
    const id = generateId();
    const barcode = generateBarcode(13);
    const { body, files } = req;
    const publicImagePath = path.resolve('public/images');

    if (body.nama && typeof Math.abs(parseFloat(body.harga)) === 'number' && files.length >= 1) {
      const { nama, harga } = body;
      const { originalname: originalName, path: oldPath } = files[0];

      await fs.rename(oldPath, path.join(publicImagePath, `/${id}.${originalName.split('.')[1]}`));
      const newData = {
        id,
        nama,
        harga,
        barcode,
        image: `${req.protocol}://${req.get('host')}/images/${id}.${originalName.split('.')[1]}`,
      };
      await dataFileManager.addData(newData);
      res.send({ newData });
    } else {
      throw new Error('Bad request!.');
    }
  } catch (err) {
    if (err.message) {
      err.status = 400;
    } else {
      err.message = 'Something went wrong! :(.';
      err.status = 500;
    }
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    await dataFileManager.checkAndCreateDir();
    const { id } = req.params;
    const data = await dataFileManager.readOneData(id);
    if (!data) {
      throw new Error('Not found!.');
    }
    res.send(data);
  } catch (err) {
    if (err.message) {
      err.status = 404;
    } else {
      err.message = 'Something went wrong! :(.';
      err.status = 500;
    }
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    await dataFileManager.checkAndCreateDir();
    const { id } = req.params;
    const { body, files } = req;
    const publicImagePath = path.resolve('public/images');

    if (body.nama && typeof Math.abs(parseFloat(body.harga)) === 'number' && files.length >= 1) {
      const { nama, harga } = body;
      const { originalname: originalName, path: oldPath } = files[0];

      const updatedData = {
        id,
        nama,
        harga,
        image: `${req.protocol}://${req.get('host')}/images/${id}.${originalName.split('.')[1]}`,
      };

      const isUpdated = await dataFileManager.updateData(updatedData);

      if (!isUpdated) {
        throw new Error('Not found!.');
      }

      await fs.rename(oldPath, path.join(publicImagePath, `/${id}.${originalName.split('.')[1]}`));
      res.send({ isUpdated, error: false });
    } else {
      throw new Error('Bad request!.');
    }
  } catch (err) {
    if (err.message === 'Bad request!.') {
      err.status = 400;
    } else if (err.message === 'Not found!.') {
      err.status = 404;
    } else {
      err.message = 'Something went wrong! :(.';
      err.status = 500;
    }
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await dataFileManager.readOneData(id);
    const isDeleted = await dataFileManager.deleteData(id);
    if (!isDeleted) {
      throw new Error('Not found!.');
    }
    await fs.unlink(path.resolve(`public/images/${data.image.split('/images/')[1]}`));

    res.send({ message: 'OK!.', error: 'false' });
  } catch (err) {
    if (err.message === 'Bad request!.') {
      err.status = 400;
    } else if (err.message === 'Not found!.') {
      err.status = 404;
    } else {
      err.message = 'Something went wrong! :(.';
      err.status = 500;
    }
    next(err);
  }
};

module.exports = {
  getAllProduct,
  postProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
