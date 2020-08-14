import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { EmployeeModel } from './employee.model';
import { EmployeeService } from './employee.service';

@Resolver(of => EmployeeModel)
export class EmployeeResolver {
  constructor(
    @Inject(EmployeeService) private employeeService: EmployeeService,
  ) {}

  @Query(returns => EmployeeModel)
  async Employee(@Args('id') id: string): Promise<EmployeeModel> {
    return await this.employeeService.findOneEmployee(id);
  }

  @Query(returns => [EmployeeModel])
  async Employees(): Promise<EmployeeModel[]> {
    return await this.employeeService.findAllEmployees();
  }
}
