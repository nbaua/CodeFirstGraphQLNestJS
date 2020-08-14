import { Field, ObjectType } from '@nestjs/graphql';
import { EmployeeModel } from 'src/employee/employee.model';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('company')
export class CompanyModel {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ name: 'name' })
  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Field(type => [EmployeeModel], { nullable: true })
  @OneToMany(
    type => EmployeeModel,
    employee => employee.company,
    { lazy: true },
  )
  @JoinColumn({ name: 'id' })
  employees: EmployeeModel[];
}
