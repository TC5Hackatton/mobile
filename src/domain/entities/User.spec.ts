import { User } from './User';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a user with all required properties', () => {
      const user = User.create(
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
      expect(user.displayName).toBe('Test User');
      expect(user.photoUrl).toBeUndefined();
      expect(user.uid).toBeUndefined();
    });

    it('should create a user with optional photoUrl parameter', () => {
      const user = User.create(
        'test@example.com',
        'password123',
        'Test User',
        'https://example.com/photo.jpg'
      );

      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
      expect(user.displayName).toBe('Test User');
      expect(user.photoUrl).toBe('https://example.com/photo.jpg');
      expect(user.uid).toBeUndefined();
    });

    it('should create a user with optional uid parameter', () => {
      const user = User.create(
        'test@example.com',
        'password123',
        'Test User',
        undefined,
        'user-123'
      );

      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
      expect(user.displayName).toBe('Test User');
      expect(user.photoUrl).toBeUndefined();
      expect(user.uid).toBe('user-123');
    });

    it('should create a user with both optional parameters', () => {
      const user = User.create(
        'john.doe@example.com',
        'securePassword456',
        'John Doe',
        'https://example.com/john.jpg',
        'user-456'
      );

      expect(user.email).toBe('john.doe@example.com');
      expect(user.password).toBe('securePassword456');
      expect(user.displayName).toBe('John Doe');
      expect(user.photoUrl).toBe('https://example.com/john.jpg');
      expect(user.uid).toBe('user-456');
    });

    it('should create users with different email formats', () => {
      const user1 = User.create('simple@test.com', 'pass', 'User 1');
      const user2 = User.create('user.name+tag@example.co.uk', 'pass', 'User 2');
      const user3 = User.create('test_user@subdomain.example.com', 'pass', 'User 3');

      expect(user1.email).toBe('simple@test.com');
      expect(user2.email).toBe('user.name+tag@example.co.uk');
      expect(user3.email).toBe('test_user@subdomain.example.com');
    });

    it('should preserve all property values correctly', () => {
      const email = 'preserve@test.com';
      const password = 'myPassword123!';
      const displayName = 'Preserve Test';
      const photoUrl = 'https://cdn.example.com/avatar.png';
      const uid = 'uid-789';

      const user = User.create(email, password, displayName, photoUrl, uid);

      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
      expect(user.displayName).toBe(displayName);
      expect(user.photoUrl).toBe(photoUrl);
      expect(user.uid).toBe(uid);
    });
  });
});
