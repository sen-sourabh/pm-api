import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomFieldsService } from './custom-fields.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';

@ApiTags('Custom Fields')
@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Post()
  createCustomField(@Body() createCustomFieldDto: CreateCustomFieldDto) {
    return this.customFieldsService.createCustomField(createCustomFieldDto);
  }

  @Get()
  findAllCustomFields() {
    return this.customFieldsService.findAllCustomFields();
  }

  @Get(':id')
  findOneCustomField(@Param('id') id: string) {
    return this.customFieldsService.findOneCustomField(id);
  }

  @Patch(':id')
  updateCustomField(@Param('id') id: string, @Body() updateCustomFieldDto: UpdateCustomFieldDto) {
    return this.customFieldsService.updateCustomField(id, updateCustomFieldDto);
  }

  @Delete(':id')
  removeCustomField(@Param('id') id: string) {
    return this.customFieldsService.removeCustomField(id);
  }
}
