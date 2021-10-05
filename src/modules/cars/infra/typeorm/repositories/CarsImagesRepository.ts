import { getRepository, Repository } from 'typeorm';

import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';

import { CarImage } from '../entities/CarImage';

class CarsImagesRepository implements ICarsImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = this.repository.create({ car_id, image_name });

    await this.repository.save(carImage);

    return carImage;
  }

  async delete(carsImages: CarImage[]): Promise<CarImage[]> {
    return this.repository.remove(carsImages);
    // const carsImageQuery = this.repository
    //   .createQueryBuilder('c')
    //   .where('car_id = :car_id', { car_id: carsImages[0].car_id })
    //   .andWhere('id IN (:...images_id)', {
    //     images_id: carsImages.map(car_image => car_image.id),
    //   });

    // await carsImageQuery.delete().execute();
  }

  async findCarsImages(
    car_id: string,
    images_id?: string[],
  ): Promise<CarImage[]> {
    const carsImageQuery = this.repository
      .createQueryBuilder('c')
      .where('car_id = :car_id', { car_id });

    if (images_id) {
      carsImageQuery.andWhere('id IN (:...images_id)', { images_id });
    }

    return carsImageQuery.getMany();
  }
}

export { CarsImagesRepository };
