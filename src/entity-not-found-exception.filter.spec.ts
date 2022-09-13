import { EntityNotFoundExceptionFilter } from './entity-not-found-exception.filter';

describe('EntityNotFoundExceptionFilter', () => {
  it('should be defined', () => {
    expect(new EntityNotFoundExceptionFilter()).toBeDefined();
  });
});
