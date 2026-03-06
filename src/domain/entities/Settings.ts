export type FontSizeScale = 'P' | 'M' | 'G';

export class Settings {
  static get VALID_FONT_SIZES(): FontSizeScale[] {
    return ['P', 'M', 'G'];
  }

  static get VALID_AMOUNT_DEFAULTS(): number[] {
    return [15, 25, 35, 45];
  }

  private constructor(
    public readonly darkMode: boolean,
    public readonly fontSize: FontSizeScale,
    public readonly amountDefault: number,
  ) { }

  static create(
    darkMode: boolean,
    fontSize: FontSizeScale,
    amountDefault: number,
  ): Settings {
    const validFontSize = Settings.VALID_FONT_SIZES.includes(fontSize) ? fontSize : 'M';
    const validAmountDefault = Settings.VALID_AMOUNT_DEFAULTS.includes(amountDefault) ? amountDefault : 25;
    return new Settings(darkMode, validFontSize, validAmountDefault);
  }
}
