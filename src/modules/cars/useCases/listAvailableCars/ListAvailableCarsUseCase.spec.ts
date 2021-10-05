import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
  });

  it('should be able to list all available cars', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Carro com espaço',
      daily_rate: 110.0,
      license_plate: 'DEF-1234',
      fine_amount: 40,
      brand: 'Audi',
      category_id: '5bc9b4b2-f4fd-4403-9694-4dc3ee0d6cc8',
    });

    await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Carro com espaço',
      daily_rate: 110.0,
      license_plate: 'DEF-1235',
      fine_amount: 40,
      brand: 'BMW',
      category_id: '5bc9b4b2-f4fd-4403-9694-4dc3ee0d6cc8',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          brand: 'BMW',
        }),
      ]),
    );
  });

  it('should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Carro com espaço',
      daily_rate: 110.0,
      license_plate: 'DEF-1234',
      fine_amount: 40,
      brand: 'Car_brand_test',
      category_id: '5bc9b4b2-f4fd-4403-9694-4dc3ee0d6cc8',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car_brand_test',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'Carro com espaço',
      daily_rate: 110.0,
      license_plate: 'DEF-1234',
      fine_amount: 40,
      brand: 'Car_brand_test',
      category_id: '5bc9b4b2-f4fd-4403-9694-4dc3ee0d6cc8',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car3',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'Carro com espaço',
      daily_rate: 110.0,
      license_plate: 'DEF-1234',
      fine_amount: 40,
      brand: 'Car_brand_test',
      category_id: '123456',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '123456',
    });

    expect(cars).toEqual([car]);
  });
});
