import { inject, injectable } from 'tsyringe';

import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { deleteFile } from '@utils/file';

interface IRequest {
  car_image: string;
  images_id: string[];
}

@injectable()
class DeleteCarImagesUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,
  ) {}

  async execute({ car_image, images_id }: IRequest): Promise<CarImage[]> {
    const carsImages = await this.carsImagesRepository.findCarsImages(
      car_image,
      images_id,
    );

    const promises = [];

    for (const carImage of carsImages) {
      promises.push(deleteFile(`./tmp/cars/${carImage.image_name}`));
    }

    await Promise.all(promises);

    const deletedCarsImages = await this.carsImagesRepository.delete(
      carsImages,
    );

    return deletedCarsImages;
  }
}

export { DeleteCarImagesUseCase };
