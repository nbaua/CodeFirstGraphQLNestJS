import { Field, ObjectType } from '@nestjs/graphql';
import { CompanyModel } from 'src/company/company.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('employee')
export class EmployeeModel {
  @Field({ name: 'id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ name: 'companyId' })
  @Column('integer', { nullable: false })
  companyId: number;

  @Field({ name: 'employeeName' })
  @Column('varchar', { length: 50, nullable: false })
  employeeName: string;

  @Field({ name: 'gender' })
  @Column('varchar', { length: 6 })
  gender: string;

  @Field({ name: 'email' })
  @Column('varchar', { length: 50 })
  email: string;

  @Field(type => CompanyModel, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'companyId' })
  @ManyToOne(
    type => CompanyModel,
    company => company.employees,
    { lazy: true },
  )
  company: CompanyModel;
}
