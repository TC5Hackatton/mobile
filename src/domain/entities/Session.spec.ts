import { Session } from './Session';

describe('Session', () => {
  describe('create', () => {
    it('should create a session with uid and token', () => {
      const uid = 'user-123';
      const token = 'mock-token-abc';

      const session = Session.create(uid, token);

      expect(session).toBeInstanceOf(Session);
      expect(session.uid).toBe(uid);
      expect(session.token).toBe(token);
    });

    it('should create different instances for different data', () => {
      const session1 = Session.create('user-1', 'token-1');
      const session2 = Session.create('user-2', 'token-2');

      expect(session1).not.toBe(session2);
      expect(session1.uid).not.toBe(session2.uid);
      expect(session1.token).not.toBe(session2.token);
    });
  });

  describe('toJSON', () => {
    it('should serialize session to JSON string', () => {
      const session = Session.create('user-456', 'token-xyz');

      const json = session.toJSON();

      expect(typeof json).toBe('string');
      const parsed = JSON.parse(json);
      expect(parsed).toEqual({
        uid: 'user-456',
        token: 'token-xyz',
      });
    });

    it('should handle special characters in uid and token', () => {
      const session = Session.create('user@email.com', 'token-with-special-chars!@#');

      const json = session.toJSON();
      const parsed = JSON.parse(json);

      expect(parsed.uid).toBe('user@email.com');
      expect(parsed.token).toBe('token-with-special-chars!@#');
    });
  });

  describe('fromJSON', () => {
    it('should deserialize JSON string to Session instance', () => {
      const json = JSON.stringify({
        uid: 'user-789',
        token: 'token-123',
      });

      const session = Session.fromJSON(json);

      expect(session).toBeInstanceOf(Session);
      expect(session.uid).toBe('user-789');
      expect(session.token).toBe('token-123');
    });

    it('should handle round-trip serialization', () => {
      const original = Session.create('user-original', 'token-original');

      const json = original.toJSON();
      const restored = Session.fromJSON(json);

      expect(restored.uid).toBe(original.uid);
      expect(restored.token).toBe(original.token);
    });

    it('should throw error for invalid JSON', () => {
      const invalidJson = 'not-valid-json';

      expect(() => Session.fromJSON(invalidJson)).toThrow();
    });

    it('should create session even with missing uid (no validation)', () => {
      const jsonWithoutUid = JSON.stringify({ token: 'token-only' });

      const session = Session.fromJSON(jsonWithoutUid);

      // Session doesn't validate, so it creates with undefined uid
      expect(session.uid).toBeUndefined();
      expect(session.token).toBe('token-only');
    });

    it('should create session even with missing token (no validation)', () => {
      const jsonWithoutToken = JSON.stringify({ uid: 'uid-only' });

      const session = Session.fromJSON(jsonWithoutToken);

      // Session doesn't validate, so it creates with undefined token
      expect(session.uid).toBe('uid-only');
      expect(session.token).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should have readonly uid property (TypeScript enforced)', () => {
      const session = Session.create('user-123', 'token-123');

      // TypeScript prevents this at compile time, but JavaScript allows it
      // This is a compile-time check, not runtime
      expect(session.uid).toBe('user-123');
    });

    it('should have readonly token property (TypeScript enforced)', () => {
      const session = Session.create('user-123', 'token-123');

      // TypeScript prevents this at compile time, but JavaScript allows it
      // This is a compile-time check, not runtime
      expect(session.token).toBe('token-123');
    });
  });
});
