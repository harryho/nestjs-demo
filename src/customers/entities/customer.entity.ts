import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  custid: number;

  @Column({ name: 'companyname', length: 40 })
  companyname: string;

  @Column({ name: 'contactname', length: 30, nullable: true })
  contactname: string;

  @Column({ name: 'contacttitle', length: 30, nullable: true })
  contacttitle: string;

  @Column({ length: 60, nullable: true })
  address: string;

  @Column({ length: 15, nullable: true })
  city: string;

  @Column({ length: 15, nullable: true })
  region: string;

  @Column({ name: 'postalcode', length: 10, nullable: true })
  postalcode: string;

  @Column({ length: 15, nullable: true })
  country: string;

  @Column({ length: 24, nullable: true })
  phone: string;

  @Column({ length: 24, nullable: true })
  fax: string;
}
