import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UserAttachmentBodyParserPipe implements PipeTransform {
  transform(value: any) {
    //append auto generated secret key with body
    console.log('PIPE :: ', value);

    return value;
  }
}
