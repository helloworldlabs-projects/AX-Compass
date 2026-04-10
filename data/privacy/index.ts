import type { PrivacyVersion } from './types';
import v1 from './v1';

// 최신 버전이 맨 앞에 위치 (내림차순)
export const privacyVersions: PrivacyVersion[] = [v1];

export const currentPrivacy = privacyVersions[0];

// 이전 처리방침 목록: 현재 버전을 포함한 전체 목록을 제공.
// v2 추가 시 → privacyVersions = [v2, v1], currentPrivacy = v2, previousPrivacyVersions = [v2, v1] 유지.
// page에서 currentPrivacy는 본문으로, 여기서는 select 옵션으로 표시된다.
export const previousPrivacyVersions = privacyVersions;
