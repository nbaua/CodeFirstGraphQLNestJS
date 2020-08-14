## Description

TypeScript-NestJS-GraphQL Code First Repository.

## Installation

### Install NestJS if not installed already

    npm i -g @nestjs/cli

### Create the NestJS application

    nest new graphql-codefirst-nest

`REQUIRED: Change to the project directory`

`OPTIONAL: Run the Nest Application to test if everything is working fine.`

### Install the required NPM packages

    npm i --save @nestjs/typeorm typeorm mysql dotenv
    npm i --save @nestjs/graphql graphql-tools graphql
    npm i --save apollo-server-express @nestjs/common

### Enable the GraphQL code first approach

Enter the following code in `app.module.ts` under imports[]

```
GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: true,
    }),
```

### Prepare the Environment

`Create the .env file with required key-value pairs, the following is the minimal required environment variables for this project.`

```
APP_PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=***********
DB_NAME=jobs-db
DB_SYNC=false
```

### Add TypeORM to the project

> Use the following to read the .env file correctly
>
> `require('dotenv').config();`

Enter the following code in `app.module.ts` under imports[],

```
TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.model.js'],
      synchronize: process.env.DB_SYNC === 'true' ? true : false,
    }),
```

`At this point compiling the project would result in the error since there is no graphql schema is defined. The purpose of the code first approach is to auto-generate this required file automatically based on the code we develop further.`

> IF YOU GET THIS ERROR

<mark>Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client</mark>

> CONSIDER ADDING THE USER AN ACCESS TO YOUR DATABASE

## Development

> `Step1: Generate Required Artifacts and Reference them in App Module`

> `Step2: Create data models for TypeORM and GraphQL Entity mapping.`

> `Step3: Implement the resolvers and services with required API operations.`

### Generate Required Resolvers, Services, and Modules

```
nest g resolver company --no-spec
nest g resolver employee --no-spec
nest g service company --no-spec
nest g service employee --no-spec
nest g module company
nest g module employee
```

The above command should generate required `skeleton` files under the directory named same as the module name.

`Update the Company Module with the following code and reference correctly.`

```
@Module({
  imports: [TypeOrmModule.forFeature([CompanyModel])],
  providers: [CompanyService, CompanyResolver],
  exports: [CompanyService],
})
export class CompanyModule {}

```

`Update the Employee Module with the following code and reference correctly.`

```
@Module({
  imports: [TypeOrmModule.forFeature([EmployeeModel])],
  providers: [EmployeeService, EmployeeResolver],
  exports: [EmployeeService],
})
export class EmployeeModule {}
```

> `Update the App Module with the Company and Employee Module reference under the imports[].`

The updated App Module should look like

```

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.model.js'],
      synchronize: process.env.DB_SYNC === 'true' ? true : false,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: true,
    }),
    EmployeeModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

### Add Database Model and GraphQL Entity Support

> \+ Create the `company.model.ts` file under the `company` directory, add and export
> the class `CompanyModel` from within the file.
>
> \+ Create the `employee.model.ts` file under the `employee` directory, add and export the class `EmployeeModel` from within the file.
>
> \+ Add column/field names of the `company` and `employee` tables respectively in above classes.
>
> \+ Mark them with the `@Field()` decorator for the GraphQL schema generation
>
> \+ Mark them with the `@Column()` decorator for the TypeORM support
>
> \+ OPTIONAL: Add TypeORM @JoinColumn() and OneToMany()/@ManyToOne() relation decorators, if the APIs needs to fetch the nested/related data.

The updated `company.model.ts` file should look as under, check the source code for `employee.model.ts` for the counter part.

```

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
```

> NOTE that the class is decorated with `@ObjectType()` and `@Entity()`. Specify the table name to the @Entity decorator to correctly generate the query by TypeORM.

> For GraphQL to map the data correctly with other relational entities (TypeORM Entities) it is mandatory to specify the `{ lazy: true },` attribute in the relations, Otherwise the result will always return `null`.

### Implement the Resolvers and Services

> \+ Inject the service reference in the resolver classes

> \+ Add the endpoints and implement the service counter parts

The implemented `company.resolver.ts` looks like

```

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

```

The implemented `company.service.ts` looks like

```

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

```

Check the source code for `employee.resolver.ts` and `employee.service.ts` for the
counter part.

### Seed the data (For now)

> Import the seed data into the MySQL tables

### Build and test the project

```
npm run build
OR
nest build
```

The above command will build the project and generate a `dist` directory.

```
npm run start
OR
nest start
```

The above command will start the Nest Application and the GraphQL Playground can be accessed at following URL.

`http://localhost:3001/graphql`

`Company API`

![Company](https://github.com/nbaua/CodeFirstGraphQLNestJS/blob/master/images/company.PNG?raw=true)

`Employee API`

![Employee](https://github.com/nbaua/CodeFirstGraphQLNestJS/blob/master/images/employee.PNG?raw=true)

## ToDo

This project is a boilerplate code for anyone to start with the Code First NestJS and GraphQL APIs using TypeORM. The following thing are still needs to be implemented.

- Add other CRUD operations
- Add exception handling
- Add validations
