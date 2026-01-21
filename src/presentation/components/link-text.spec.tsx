import { render, screen } from '@testing-library/react-native';
import { LinkText } from './link-text';

test('examples of some things', async () => {
  render(<LinkText text="Test" onPress={() => {}} />);
  expect(screen.getByText('Test')).toBeOnTheScreen();
});
