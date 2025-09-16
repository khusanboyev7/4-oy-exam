import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RepositoryPager } from '../pagination';
import {
  IFindOptions,
  IResponsePagination,
  ISuccess,
} from '../response/succes.interface';
import { getSuccessRes } from 'src/common/util/get-succes-res';
export class BaseService<CreateDto, UpdateDto, Entity> {
  constructor(private readonly repository: Repository<any>) {}

  get getRepository() {
    return this.repository;
  }

  async create(dto: CreateDto): Promise<ISuccess> {
    let data = this.repository.create({
      ...dto,
    }) as any as Entity;
    data = await this.repository.save(data);
    return getSuccessRes({ data }, 201);
  }

  async findAll(options?: IFindOptions<Entity>): Promise<ISuccess> {
    const data = (await this.repository.find({
      ...options,
    })) as Entity[];
    return getSuccessRes(data);
  }

  async findAllWithPagination(
    options?: IFindOptions<Entity>,
  ): Promise<IResponsePagination> {
    return await RepositoryPager.findAll(this.getRepository, options);
  }

  async findOneBy(options: IFindOptions<Entity>): Promise<ISuccess> {
    const data = (await this.repository.findOne({
      select: options.select || {},
      relations: options.relations || [],
      where: options.where,
    })) as Entity;
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return getSuccessRes(data);
  }

  async findOneById(
    id: number,
    options?: IFindOptions<Entity>,
  ): Promise<ISuccess> {
    const data = (await this.repository.findOne({
      select: options?.select || {},
      relations: options?.relations || [],
      where: { id, ...options?.where },
    })) as unknown as Entity;
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return getSuccessRes(data);
  }

  async update(id: number, dto: UpdateDto): Promise<ISuccess> {
    await this.findOneById(id);
    await this.repository.update(id, dto as any);
    const data = await this.repository.findOne({ where: { id } });
    return getSuccessRes(data);
  }

  async delete(id: number): Promise<ISuccess> {
    await this.findOneById(id);
    (await this.repository.delete(id)) as unknown as Entity;
    return getSuccessRes({});
  }
}
