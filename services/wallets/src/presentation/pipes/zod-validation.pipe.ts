import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues[0];
        const field = firstIssue.path.join('.') || 'value';
        throw new BadRequestException(`${field}: ${firstIssue.message}`);
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
