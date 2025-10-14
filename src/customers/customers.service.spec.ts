import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: Repository<Customer>;

  const mockCustomer: Customer = {
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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      mockRepository.create.mockReturnValue(mockCustomer);
      mockRepository.save.mockResolvedValue(mockCustomer);

      const result = await service.create(mockCustomer);

      expect(result).toEqual(mockCustomer);
      expect(mockRepository.create).toHaveBeenCalledWith(mockCustomer);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      mockRepository.find.mockResolvedValue([mockCustomer]);

      const result = await service.findAll();

      expect(result).toEqual([mockCustomer]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCustomer);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { custid: 1 },
      });
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updatedCustomer = { ...mockCustomer, companyname: 'Updated Name' };
      mockRepository.findOne.mockResolvedValue(mockCustomer);
      mockRepository.save.mockResolvedValue(updatedCustomer);

      const result = await service.update(1, { companyname: 'Updated Name' });

      expect(result.companyname).toBe('Updated Name');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);
      mockRepository.remove.mockResolvedValue(mockCustomer);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockCustomer);
    });
  });
});
