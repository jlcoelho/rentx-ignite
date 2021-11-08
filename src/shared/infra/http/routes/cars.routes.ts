import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { DeleteCarImagesController } from '@modules/cars/useCases/deleteCarImage/DeleteCarImagesController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImage/UploadCarImagesController';

import { ensunreAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();
const deleteCarImagesController = new DeleteCarImagesController();

const upload = multer(uploadConfig);

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensunreAdmin,
  createCarController.handle,
);

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.post(
  '/specifications/:id',
  ensureAuthenticated,
  ensunreAdmin,
  createCarSpecificationController.handle,
);

carsRoutes.post(
  '/images/:id',
  ensureAuthenticated,
  ensunreAdmin,
  upload.array('images'),
  uploadCarImagesController.handle,
);

carsRoutes.delete(
  '/images/:id',
  ensureAuthenticated,
  ensunreAdmin,
  deleteCarImagesController.handle,
);

export { carsRoutes };
