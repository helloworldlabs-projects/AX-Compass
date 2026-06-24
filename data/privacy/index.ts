import type { PrivacyVersion } from './types';
import v1 from './v1';
import v2 from './v2';

// 최신 버전이 맨 앞에 위치 (내림차순)
export const privacyVersions: PrivacyVersion[] = [v2, v1];

export const currentPrivacy = privacyVersions[0];

// 이전 처리방침 목록: 현재 버전을 포함한 전체 목록을 제공.
// page에서 currentPrivacy는 본문으로, 여기서는 select 옵션으로 표시된다.
export const previousPrivacyVersions = privacyVersions;
