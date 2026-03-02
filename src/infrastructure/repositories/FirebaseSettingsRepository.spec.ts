import { Settings } from '@/src/domain';
import { FirebaseSettingsRepository } from './FirebaseSettingsRepository';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({ id: 'mock-doc' })),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
  __esModule: true,
  default: {
    db: {},
  },
}));

const { doc, getDoc, setDoc } = require('firebase/firestore');
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

    it('should return Settings when document has appearance and timer', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          appearance: { dark_mode: true, font_size: 'G' },
          timer: { amount_default: 35, pause_reminder: true },
        }),
      });

      const result = await repository.fetch('uid-123');

      expect(result).toBeInstanceOf(Settings);
      expect(result).not.toBeNull();
      expect(result!.darkMode).toBe(true);
      expect(result!.fontSize).toBe('G');
      expect(result!.amountDefault).toBe(35);
      expect(result!.pauseReminder).toBe(true);
    });

    it('should use defaults when document has partial or missing data', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          appearance: {},
          timer: {},
        }),
      });

      const result = await repository.fetch('uid-123');

      expect(result).toBeInstanceOf(Settings);
      expect(result!.darkMode).toBe(false);
      expect(result!.fontSize).toBe('M');
      expect(result!.amountDefault).toBe(25);
      expect(result!.pauseReminder).toBe(false);
    });

    it('should normalize invalid values via Settings.create', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          appearance: { dark_mode: true, font_size: 'X' },
          timer: { amount_default: 99, pause_reminder: true },
        }),
      });

      const result = await repository.fetch('uid-123');

      expect(result).toBeInstanceOf(Settings);
      expect(result!.fontSize).toBe('M');
      expect(result!.amountDefault).toBe(25);
    });
  });

  describe('update', () => {
    it('should merge appearance update with existing data', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          appearance: { dark_mode: false, font_size: 'M' },
          timer: { amount_default: 25, pause_reminder: false },
        }),
      });
      setDoc.mockResolvedValue(undefined);

      await repository.update('uid-123', { darkMode: true });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        {
          appearance: {
            dark_mode: true,
            font_size: 'M',
          },
        },
        { merge: true },
      );
    });

    it('should merge timer update with existing data', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          appearance: { dark_mode: false, font_size: 'M' },
          timer: { amount_default: 25, pause_reminder: false },
        }),
      });
      setDoc.mockResolvedValue(undefined);

      await repository.update('uid-123', { amountDefault: 35, pauseReminder: true });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        {
          timer: {
            amount_default: 35,
            pause_reminder: true,
          },
        },
        { merge: true },
      );
    });

    it('should not call setDoc when data is empty', async () => {
      getDoc.mockResolvedValue({ exists: () => true, data: () => ({}) });

      await repository.update('uid-123', {});

      expect(setDoc).not.toHaveBeenCalled();
    });

    it('should create new doc when it does not exist', async () => {
      getDoc.mockResolvedValue({ exists: () => false });
      setDoc.mockResolvedValue(undefined);

      await repository.update('uid-123', { fontSize: 'P' });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { appearance: { font_size: 'P' } },
        { merge: true },
      );
    });
  });
});
