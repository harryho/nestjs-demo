import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  const mockCustomer = {
    custid: 1,
    companyname: 'Alfreds Futterkiste',
    contactname: 'Maria Anders',
    contacttitle: 'Sales Representative',
    address: 'Obere Str. 57',
    city: 'Berlin',
    region: null,
    postalcode: '12209',
    country: 'Germany',
    phone: '030-0074321',
    fax: '030-0076545',
  };

  const mockCustomersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      mockCustomersService.create.mockResolvedValue(mockCustomer);

      const result = await controller.create(mockCustomer);

      expect(result).toEqual(mockCustomer);
      expect(service.create).toHaveBeenCalledWith(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      mockCustomersService.findAll.mockResolvedValue([mockCustomer]);

      const result = await controller.findAll();

      expect(result).toEqual([mockCustomer]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      mockCustomersService.findOne.mockResolvedValue(mockCustomer);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockCustomer);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updatedCustomer = { ...mockCustomer, companyname: 'Updated Name' };
      mockCustomersService.update.mockResolvedValue(updatedCustomer);

      const result = await controller.update(1, { companyname: 'Updated Name' });

      expect(result).toEqual(updatedCustomer);
      expect(service.update).toHaveBeenCalledWith(1, { companyname: 'Updated Name' });
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      mockCustomersService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
