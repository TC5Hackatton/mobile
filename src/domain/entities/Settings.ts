export type FontSizeScale = 'P' | 'M' | 'G';

const VALID_FONT_SIZES: FontSizeScale[] = ['P', 'M', 'G'];
const VALID_AMOUNT_DEFAULTS = [15, 25, 35, 45];

export class Settings {
  private constructor(
    public readonly darkMode: boolean,
    public readonly fontSize: FontSizeScale,
    public readonly amountDefault: number,
    public readonly pauseReminder: boolean,
  ) {}

  static create(
    darkMode: boolean,
    fontSize: FontSizeScale,
    amountDefault: number,
    pauseReminder: boolean,
  ): Settings {
    const validFontSize = VALID_FONT_SIZES.includes(fontSize) ? fontSize : 'M';
    const validAmountDefault = VALID_AMOUNT_DEFAULTS.includes(amountDefault) ? amountDefault : 25;
    return new Settings(darkMode, validFontSize, validAmountDefault, pauseReminder);
  }
}
