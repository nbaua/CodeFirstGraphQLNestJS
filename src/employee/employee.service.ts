import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeModel } from './employee.model';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeModel)
    private employeeRepository: Repository<EmployeeModel>,
  ) {}

  findOneEmployee(id: string): Promise<EmployeeModel> {
    return this.employeeRepository.findOne(id);
  }

  findAllEmployees(): Promise<EmployeeModel[]> {
    return this.employeeRepository.find();
  }
}
