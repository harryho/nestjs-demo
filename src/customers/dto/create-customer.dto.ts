import { IsString, IsOptional, Length, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Acme Corporation', description: 'Company name' })
  @IsString()
  @Length(1, 40)
  companyname: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Contact person name' })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  contactname?: string;

  @ApiPropertyOptional({ example: 'Sales Manager', description: 'Contact person title' })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  contacttitle?: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Street address' })
  @IsOptional()
  @IsString()
  @Length(1, 60)
  address?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'City' })
  @IsOptional()
  @IsString()
  @Length(1, 15)
  city?: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State/Region' })
  @IsOptional()
  @IsString()
  @Length(1, 15)
  region?: string;

  @ApiPropertyOptional({ example: '10001', description: 'Postal code' })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  postalcode?: string;

  @ApiPropertyOptional({ example: 'USA', description: 'Country' })
  @IsOptional()
  @IsString()
  @Length(1, 15)
  country?: string;

  @ApiPropertyOptional({ example: '555-1234', description: 'Phone number' })
  @IsOptional()
  @IsString()
  @Length(1, 24)
  phone?: string;

  @ApiPropertyOptional({ example: '555-5678', description: 'Fax number' })
  @IsOptional()
  @IsString()
  @Length(1, 24)
  fax?: string;
}
