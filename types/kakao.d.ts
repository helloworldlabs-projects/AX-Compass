interface KakaoShareSettings {
  objectType: 'feed' | 'list' | 'location' | 'commerce' | 'text' | 'calendar';
  text?: string;
  link?: {
    mobileWebUrl?: string;
    webUrl?: string;
  };
  [key: string]: unknown;
}

interface Window {
  Kakao: {
    init: (key: string) => void;
    isInitialized: () => boolean;
    Share: {
      sendDefault: (settings: KakaoShareSettings) => void;
    };
  };
}
