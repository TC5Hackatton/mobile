import { Settings } from './Settings';

describe('Settings', () => {
  describe('create', () => {
    it('should create settings with provided values', () => {
      const settings = Settings.create(true, 'M', 25);

      expect(settings).toBeInstanceOf(Settings);
      expect(settings.darkMode).toBe(true);
      expect(settings.fontSize).toBe('M');
      expect(settings.amountDefault).toBe(25);
    });

    it('should create different instances for different data', () => {
      const s1 = Settings.create(false, 'P', 15);
      const s2 = Settings.create(true, 'G', 45);

      expect(s1).not.toBe(s2);
      expect(s1.darkMode).toBe(false);
      expect(s2.darkMode).toBe(true);
      expect(s1.fontSize).toBe('P');
      expect(s2.fontSize).toBe('G');
      expect(s1.amountDefault).toBe(15);
      expect(s2.amountDefault).toBe(45);
    });

    it('should default fontSize to M when invalid', () => {
      const settings = Settings.create(false, 'X' as any, 25);

      expect(settings.fontSize).toBe('M');
    });

    it('should default amountDefault to 25 when invalid', () => {
      const settings = Settings.create(false, 'M', 99);

      expect(settings.amountDefault).toBe(25);
    });

    it('should accept all valid font sizes', () => {
      expect(Settings.create(false, 'P', 25).fontSize).toBe('P');
      expect(Settings.create(false, 'M', 25).fontSize).toBe('M');
      expect(Settings.create(false, 'G', 25).fontSize).toBe('G');
    });

    it('should accept all valid amount defaults', () => {
      expect(Settings.create(false, 'M', 15).amountDefault).toBe(15);
      expect(Settings.create(false, 'M', 25).amountDefault).toBe(25);
      expect(Settings.create(false, 'M', 35).amountDefault).toBe(35);
      expect(Settings.create(false, 'M', 45).amountDefault).toBe(45);
    });

    it('should expose valid font sizes as static member', () => {
      expect(Settings.VALID_FONT_SIZES).toEqual(['P', 'M', 'G']);
    });

    it('should expose valid amount defaults as static member', () => {
      expect(Settings.VALID_AMOUNT_DEFAULTS).toEqual([15, 25, 35, 45]);
    });
  });
});
