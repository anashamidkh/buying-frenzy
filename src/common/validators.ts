import { TransformFnParams } from 'class-transformer';

export const parseIntTransformer = (params: TransformFnParams) => {
  if (params.value && !isNaN(params.value)) {
    return parseInt(params.value);
  }
  return null;
};

export const parseFloatTransformer = (params: TransformFnParams) => {
  if (params.value && !isNaN(params.value)) {
    return parseFloat(params.value);
  }
  return null;
};