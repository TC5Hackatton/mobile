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

    it('should throw error for JSON missing uid', () => {
      const jsonWithoutUid = JSON.stringify({ token: 'token-only' });

      expect(() => Session.fromJSON(jsonWithoutUid)).toThrow();
    });

    it('should throw error for JSON missing token', () => {
      const jsonWithoutToken = JSON.stringify({ uid: 'uid-only' });

      expect(() => Session.fromJSON(jsonWithoutToken)).toThrow();
    });
  });

  describe('immutability', () => {
    it('should have readonly uid property', () => {
      const session = Session.create('user-123', 'token-123');

      // TypeScript should prevent this, but we can test runtime behavior
      expect(() => {
        // @ts-expect-error - Testing readonly property
        session.uid = 'new-uid';
      }).toThrow();
    });

    it('should have readonly token property', () => {
      const session = Session.create('user-123', 'token-123');

      // TypeScript should prevent this, but we can test runtime behavior
      expect(() => {
        // @ts-expect-error - Testing readonly property
        session.token = 'new-token';
      }).toThrow();
    });
  });
});
