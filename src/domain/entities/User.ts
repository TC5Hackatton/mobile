export class User {
  private constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly displayName: string,
    public readonly photoUrl?: string,
    public readonly uid?: string,
  ) {}

  static create(email: string, password: string, displayName: string, photoUrl?: string, uid?: string) {
    return new User(email, password, displayName, photoUrl, uid);
  }
}
