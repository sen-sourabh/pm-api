import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Define reusable response objects with clear descriptions
const commonResponses = {
  bad_request: ApiBadRequestResponse({
    description: 'Bad request',
  }),
  unauthorized: ApiUnauthorizedResponse({
    description: 'Unauthorized',
  }),
  not_implemented: ApiNotImplementedResponse({
    description: 'Not Implemented',
  }),
  not_found: ApiNotFoundResponse({
    description: 'Not Found',
  }),
  conflict: ApiConflictResponse({
    description: 'Conflict',
  }),
};

// Create a decorator factory for applying common decorators
export const ApiXResponses =
  (...args: string[]) =>
  (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    const decorators = [];

    // Apply common responses based on the provided arguments
    for (const arg of args) {
      if (commonResponses[arg]) {
        decorators.push(commonResponses[arg]);
      } else {
        console.warn(`Invalid response type: ${arg}`); // Handle invalid arguments
      }
    }

    // Apply the decorators using applyDecorators
    return applyDecorators(...decorators)(target, propertyKey, descriptor);
  };
