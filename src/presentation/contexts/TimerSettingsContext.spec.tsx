import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { TimerSettingsProvider, useTimerSettings } from './TimerSettingsContext';

jest.mock('./SessionContext', () => ({ useSession: jest.fn() }));
jest.mock('./SettingsContext', () => ({ useSettings: jest.fn() }));
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const { useSession } = require('./SessionContext');
const { useSettings } = require('./SettingsContext');
const Toast = require('react-native-toast-message');

const mockFetchSettingsUseCase = { execute: jest.fn() };
const mockUpdateSettingsUseCase = { execute: jest.fn() };

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TimerSettingsProvider>{children}</TimerSettingsProvider>
);

describe('TimerSettingsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettings.mockReturnValue({
      fetchSettingsUseCase: mockFetchSettingsUseCase,
      updateSettingsUseCase: mockUpdateSettingsUseCase,
    });
  });

  describe('initial load', () => {
    it('should default amountDefault to 25 and stop loading when there is no session', async () => {
      useSession.mockReturnValue({ session: null });

      const { result } = renderHook(() => useTimerSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.amountDefault).toBe(25);
      expect(mockFetchSettingsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should fetch and apply amountDefault from Firebase on session start', async () => {
      useSession.mockReturnValue({ session: { uid: 'user-1' } });
      mockFetchSettingsUseCase.execute.mockResolvedValue({ amountDefault: 45 });

      const { result } = renderHook(() => useTimerSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.amountDefault).toBe(45);
      expect(mockFetchSettingsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should show a toast and stop loading when fetch fails', async () => {
      useSession.mockReturnValue({ session: { uid: 'user-1' } });
      mockFetchSettingsUseCase.execute.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTimerSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error', text1: 'Falha ao carregar configurações do timer' }),
      );
      expect(result.current.amountDefault).toBe(25);
    });
  });

  describe('setAmountDefault', () => {
    it('should update amountDefault state immediately', async () => {
      useSession.mockReturnValue({ session: { uid: 'user-1' } });
      mockFetchSettingsUseCase.execute.mockResolvedValue({ amountDefault: 25 });
      mockUpdateSettingsUseCase.execute.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTimerSettings(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setAmountDefault(35);
      });

      expect(result.current.amountDefault).toBe(35);
    });

    it('should persist the new value to Firebase when a session exists', async () => {
      useSession.mockReturnValue({ session: { uid: 'user-1' } });
      mockFetchSettingsUseCase.execute.mockResolvedValue({ amountDefault: 25 });
      mockUpdateSettingsUseCase.execute.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTimerSettings(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setAmountDefault(15);
      });

      await waitFor(() => expect(mockUpdateSettingsUseCase.execute).toHaveBeenCalledWith({ amountDefault: 15 }));
    });

    it('should NOT call updateSettingsUseCase when there is no session', async () => {
      useSession.mockReturnValue({ session: null });

      const { result } = renderHook(() => useTimerSettings(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setAmountDefault(35);
      });

      expect(mockUpdateSettingsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should show a toast when persist to Firebase fails', async () => {
      useSession.mockReturnValue({ session: { uid: 'user-1' } });
      mockFetchSettingsUseCase.execute.mockResolvedValue({ amountDefault: 25 });
      mockUpdateSettingsUseCase.execute.mockRejectedValue(new Error('Save failed'));

      const { result } = renderHook(() => useTimerSettings(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setAmountDefault(45);
      });

      await waitFor(() =>
        expect(Toast.show).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'error', text1: 'Falha ao salvar tempo padrão no Firebase' }),
        ),
      );
    });
  });

  describe('useTimerSettings', () => {
    it('should throw when used outside TimerSettingsProvider', () => {
      const { result } = renderHook(() => {
        try {
          return useTimerSettings();
        } catch (e) {
          return e as Error;
        }
      });

      expect(result.current).toBeInstanceOf(Error);
      expect((result.current as Error).message).toBe('useTimerSettings must be used within TimerSettingsProvider');
    });
  });
});
