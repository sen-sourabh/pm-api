import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { CustomField } from './entities/custom-field.entity';

@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectRepository(CustomField)
    private readonly customFieldsRepository: Repository<CustomField>,
  ) {}

  createCustomField(createCustomFieldDto: CreateCustomFieldDto) {
    return 'This action adds a new customField';
  }

  findAllCustomFields() {
    return `This action returns all customFields`;
  }

  findOneCustomField(id: string) {
    return `This action returns a #${id} customField`;
  }

  updateCustomField(id: string, updateCustomFieldDto: UpdateCustomFieldDto) {
    return `This action updates a #${id} customField`;
  }

  removeCustomField(id: string) {
    return `This action removes a #${id} customField`;
  }
}
