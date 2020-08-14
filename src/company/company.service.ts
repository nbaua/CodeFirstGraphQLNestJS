import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyModel } from './company.model';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyModel)
    private CompanyRepository: Repository<CompanyModel>,
  ) {}

  findOneCompany(id: string): Promise<CompanyModel> {
    return this.CompanyRepository.findOne(id);
  }

  findAllCompanies(): Promise<CompanyModel[]> {
    return this.CompanyRepository.find();
  }
}
