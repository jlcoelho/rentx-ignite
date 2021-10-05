import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteCarImagesUseCase } from './DeleteCarImagesUseCase';

class DeleteCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { images_id } = request.body;

    const deleteCarImagesUseCase = container.resolve(DeleteCarImagesUseCase);

    const deletedCarsImages = await deleteCarImagesUseCase.execute({
      car_image: id,
      images_id,
    });

    return response.json(deletedCarsImages);
  }
}

export { DeleteCarImagesController };
