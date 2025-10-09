// Global type extensions

// Google Analytics gtag function
interface Gtag {
  (
    command: 'consent',
    action: 'update',
    config: {
      ad_user_data?: 'granted' | 'denied';
      ad_personalization?: 'granted' | 'denied';
      ad_storage?: 'granted' | 'denied';
      analytics_storage?: 'granted' | 'denied';
    }
  ): void;
  (command: string, ...args: unknown[]): void;
}

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export {};
