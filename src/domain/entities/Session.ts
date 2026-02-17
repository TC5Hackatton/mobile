export class Session {
  private constructor( public readonly uid: string, public readonly token: string) {}

  static create(uid: string, token: string) {
    return new Session(uid, token);
  }

  static fromJSON(json: string): Session {
    const data = JSON.parse(json);
    return new Session(data.uid, data.token);
  }

  toJSON(): string {
    return JSON.stringify({
      uid: this.uid,
      token: this.token,
    });
  }
}
