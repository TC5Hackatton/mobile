import { InMemoryLoggerRepository } from './InMemoryLoggerRepository';

// Mock console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  info: console.info,
};

describe('InMemoryLoggerRepository', () => {
  let repository: InMemoryLoggerRepository;

  beforeEach(() => {
    repository = new InMemoryLoggerRepository();
    console.log = jest.fn();
    console.error = jest.fn();
    console.info = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
  });

  describe('log', () => {
    it('should log string content in development mode', () => {
      const message = 'Test log message';

      repository.log(message);

      expect(console.log).toHaveBeenCalledWith(message);
      expect(console.log).toHaveBeenCalledTimes(1);
    });

    it('should log object content in development mode', () => {
      const obj = { key: 'value', number: 123 };

      repository.log(obj);

      expect(console.log).toHaveBeenCalledWith(obj);
      expect(console.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('should log error string in development mode', () => {
      const message = 'Error message';

      repository.error(message);

      expect(console.error).toHaveBeenCalledWith(message, undefined);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should log error object in development mode', () => {
      const errorObj = { error: 'Something went wrong' };

      repository.error(errorObj);

      expect(console.error).toHaveBeenCalledWith(errorObj, undefined);
    });

    it('should log error with Error object', () => {
      const message = 'Error occurred';
      const error = new Error('Detailed error');

      repository.error(message, error);

      expect(console.error).toHaveBeenCalledWith(message, error);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should log object with Error object', () => {
      const errorObj = { context: 'test' };
      const error = new Error('Test error');

      repository.error(errorObj, error);

      expect(console.error).toHaveBeenCalledWith(errorObj, error);
    });
  });

  describe('info', () => {
    it('should log info message in development mode', () => {
      const message = 'Info message';

      repository.info(message);

      expect(console.info).toHaveBeenCalledWith(message);
      expect(console.info).toHaveBeenCalledTimes(1);
    });

    it('should handle empty string', () => {
      repository.info('');

      expect(console.info).toHaveBeenCalledWith('');
    });
  });
});
