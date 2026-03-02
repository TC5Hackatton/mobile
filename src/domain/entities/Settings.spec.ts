import { Settings } from './Settings';

describe('Settings', () => {
  describe('create', () => {
    it('should create settings with provided values', () => {
      const settings = Settings.create(true, 'M', 25, false);

      expect(settings).toBeInstanceOf(Settings);
      expect(settings.darkMode).toBe(true);
      expect(settings.fontSize).toBe('M');
      expect(settings.amountDefault).toBe(25);
      expect(settings.pauseReminder).toBe(false);
    });

    it('should create different instances for different data', () => {
      const s1 = Settings.create(false, 'P', 15, true);
      const s2 = Settings.create(true, 'G', 45, false);

      expect(s1).not.toBe(s2);
      expect(s1.darkMode).toBe(false);
      expect(s2.darkMode).toBe(true);
      expect(s1.fontSize).toBe('P');
      expect(s2.fontSize).toBe('G');
      expect(s1.amountDefault).toBe(15);
      expect(s2.amountDefault).toBe(45);
      expect(s1.pauseReminder).toBe(true);
      expect(s2.pauseReminder).toBe(false);
    });

    it('should default fontSize to M when invalid', () => {
      const settings = Settings.create(false, 'X' as any, 25, false);

      expect(settings.fontSize).toBe('M');
    });

    it('should default amountDefault to 25 when invalid', () => {
      const settings = Settings.create(false, 'M', 99, false);

      expect(settings.amountDefault).toBe(25);
    });

    it('should accept all valid font sizes', () => {
      expect(Settings.create(false, 'P', 25, false).fontSize).toBe('P');
      expect(Settings.create(false, 'M', 25, false).fontSize).toBe('M');
      expect(Settings.create(false, 'G', 25, false).fontSize).toBe('G');
    });

    it('should accept all valid amount defaults', () => {
      expect(Settings.create(false, 'M', 15, false).amountDefault).toBe(15);
      expect(Settings.create(false, 'M', 25, false).amountDefault).toBe(25);
      expect(Settings.create(false, 'M', 35, false).amountDefault).toBe(35);
      expect(Settings.create(false, 'M', 45, false).amountDefault).toBe(45);
    });
  });
});
