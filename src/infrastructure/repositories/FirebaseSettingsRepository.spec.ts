import { Settings } from '@/src/domain';
import { FirebaseSettingsRepository } from './FirebaseSettingsRepository';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({ id: 'mock-doc' })),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
  __esModule: true,
  default: { db: {} },
}));

const { doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');
const firebaseConfig = require('@/firebaseConfig').default;

describe('FirebaseSettingsRepository', () => {
  let repository: FirebaseSettingsRepository;

  beforeEach(() => {
    repository = new FirebaseSettingsRepository();
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it('should return null when document does not exist', async () => {
      getDoc.mockResolvedValue({ exists: () => false });

      const result = await repository.fetch('uid-123');

      expect(doc).toHaveBeenCalledWith(firebaseConfig.db, 'settings', 'uid-123');
      expect(result).toBeNull();
    });

    it('should return Settings when document has appearance and timer data', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          appearance: { dark_mode: true, font_size: 'G' },
          timer: { amount_default: 35 },
        }),
      });

      const result = await repository.fetch('uid-123');

      expect(result).toBeInstanceOf(Settings);
      expect(result!.darkMode).toBe(true);
      expect(result!.fontSize).toBe('G');
      expect(result!.amountDefault).toBe(35);
    });

    it('should use defaults when document has partial or missing data', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ appearance: {}, timer: {} }),
      });

      const result = await repository.fetch('uid-123');

      expect(result).toBeInstanceOf(Settings);
      expect(result!.darkMode).toBe(false);
      expect(result!.fontSize).toBe('M');
      expect(result!.amountDefault).toBe(25);
    });

    it('should normalize invalid values via Settings.create', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          appearance: { dark_mode: true, font_size: 'X' },
          timer: { amount_default: 99 },
        }),
      });

      const result = await repository.fetch('uid-123');

      expect(result!.fontSize).toBe('M');
      expect(result!.amountDefault).toBe(25);
    });
  });

  describe('update', () => {
    it('should do nothing when data is empty', async () => {
      await repository.update('uid-123', {});

      expect(getDoc).not.toHaveBeenCalled();
      expect(updateDoc).not.toHaveBeenCalled();
      expect(setDoc).not.toHaveBeenCalled();
    });

    it('should use updateDoc with dot-notation paths when document exists', async () => {
      getDoc.mockResolvedValue({ exists: () => true });
      updateDoc.mockResolvedValue(undefined);

      await repository.update('uid-123', { darkMode: true });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { 'appearance.dark_mode': true },
      );
    });

    it('should use setDoc with a nested object when document does not exist', async () => {
      getDoc.mockResolvedValue({ exists: () => false });
      setDoc.mockResolvedValue(undefined);

      await repository.update('uid-123', { fontSize: 'P' });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { appearance: { font_size: 'P' } },
      );
    });

    it('should build correct nested object for multiple fields across groups', async () => {
      getDoc.mockResolvedValue({ exists: () => false });
      setDoc.mockResolvedValue(undefined);

      await repository.update('uid-123', { darkMode: true, amountDefault: 35 });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        {
          appearance: { dark_mode: true },
          timer: { amount_default: 35 },
        },
      );
    });

    it('should map multiple fields to their dot-notation paths', async () => {
      getDoc.mockResolvedValue({ exists: () => true });
      updateDoc.mockResolvedValue(undefined);

      await repository.update('uid-123', { darkMode: true, fontSize: 'G', amountDefault: 35 });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        {
          'appearance.dark_mode': true,
          'appearance.font_size': 'G',
          'timer.amount_default': 35,
        },
      );
    });
  });
});
