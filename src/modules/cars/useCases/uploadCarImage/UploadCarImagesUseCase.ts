import { inject, injectable } from 'tsyringe';

import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<void> {
    const resultsPromises = [];

    for (const image of images_name) {
      resultsPromises.push(this.carsImagesRepository.create(car_id, image));
    }

    await Promise.all(resultsPromises);
  }
}

export { UploadCarImagesUseCase };
