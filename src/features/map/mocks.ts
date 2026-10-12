export type Hospital = {
  id: number;
  name: string;
  shortLabel: string;
  address: string;
  distance: string;
  latitude: number;
  longitude: number;
  designated: boolean;
};

export const filterChips = ['산재 지정', '정형외과', '재활의학과', '야간진료'];
