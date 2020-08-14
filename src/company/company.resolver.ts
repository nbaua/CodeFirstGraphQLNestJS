import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CompanyModel } from './company.model';
import { CompanyService } from './company.service';

@Resolver(of => CompanyModel)
export class CompanyResolver {
  constructor(@Inject(CompanyService) private CompanyService: CompanyService) {}

  @Query(returns => CompanyModel)
  async Company(@Args('id') id: string): Promise<CompanyModel> {
    return await this.CompanyService.findOneCompany(id);
  }

  @Query(returns => CompanyModel)
  async Companies(): Promise<CompanyModel[]> {
    return await this.CompanyService.findAllCompanies();
  }
}
