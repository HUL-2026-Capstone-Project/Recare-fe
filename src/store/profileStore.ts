import { create } from 'zustand';

import { userApi } from '@/api/userApi';
import type { UserUpdateRequest } from '@/api/userApi';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';
import type { Profile } from '@/features/profile/mocks';
import { mapUserResponseToProfile } from '@/features/profile/mapper';

type ProfileStatus = 'idle' | 'loading' | 'success' | 'error';

type ProfileState = {
  profile: Profile | null;
  status: ProfileStatus;
  errorMessage: string | null;
  fieldErrors: Record<string, string> | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UserUpdateRequest) => Promise<void>;
  reset: () => void;
};

function toFieldErrorMap(apiError: ApiError): Record<string, string> | null {
  if (!apiError.fieldErrors?.length) return null;
  return Object.fromEntries(apiError.fieldErrors.map((f) => [f.field, f.message]));
}

// 프로필 데이터는 메모리(zustand)에만 두고 디스크에 저장하지 않는다.
export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  status: 'idle',
  errorMessage: null,
  fieldErrors: null,

  fetchProfile: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', errorMessage: null, fieldErrors: null });
    try {
      const res = await userApi.getMyProfile();
      set({ profile: mapUserResponseToProfile(res), status: 'success', errorMessage: null, fieldErrors: null });
    } catch (e) {
      const apiError = e as ApiError;
      set({ status: 'error', errorMessage: getErrorMessage(apiError), fieldErrors: null });
    }
  },

  updateProfile: async (payload: UserUpdateRequest) => {
    set({ status: 'loading', errorMessage: null, fieldErrors: null });
    try {
      const res = await userApi.updateProfile(payload);
      set({ profile: mapUserResponseToProfile(res), status: 'success', errorMessage: null, fieldErrors: null });
    } catch (e) {
      const apiError = e as ApiError;
      set({ status: 'error', errorMessage: getErrorMessage(apiError), fieldErrors: toFieldErrorMap(apiError) });
      throw e;
    }
  },

  reset: () => set({ profile: null, status: 'idle', errorMessage: null, fieldErrors: null }),
}));
