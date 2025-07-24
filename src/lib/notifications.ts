// Notification service for PWA
export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize service worker and notifications
  async initialize(): Promise<boolean> {
    try {
      // Register service worker
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      }

      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }

      return false;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  // Send local notification
  async sendNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.hasPermission()) {
      console.warn('Notification permission not granted');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      requireInteraction: true,
      ...options
    };

    if (this.registration) {
      // Use service worker for better reliability
      await this.registration.showNotification(title, defaultOptions);
    } else {
      // Fallback to regular notification
      new Notification(title, defaultOptions);
    }
  }

  // Check if notifications are supported and permitted
  hasPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  // Get notification permission status
  getPermissionStatus(): NotificationPermission {
    return 'Notification' in window ? Notification.permission : 'denied';
  }

  // Subscribe to push notifications (for future server integration)
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('Service worker not registered');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          // This would be your VAPID public key in production
          'BEl62iUYgUivxIkv69yViEuiBIa40HI80NqIUHI80NqIUHI80NqIUHI80NqIUHI80NqIUHI80NqI'
        )
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // Helper function to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Predefined notification types for the app
  async notifyNewDocument(documentTitle: string): Promise<void> {
    await this.sendNotification('Novo Documento Disponível', {
      body: `${documentTitle} foi adicionado à sua conta`,
      icon: '/icon-192.png',
      tag: 'new-document',
      data: { type: 'document', title: documentTitle }
    });
  }

  async notifyNewIdea(ideaTitle: string): Promise<void> {
    await this.sendNotification('Nova Ideia Adicionada', {
      body: `${ideaTitle} foi salva no seu banco de ideias`,
      icon: '/icon-192.png',
      tag: 'new-idea',
      data: { type: 'idea', title: ideaTitle }
    });
  }

  async notifySystemUpdate(message: string): Promise<void> {
    await this.sendNotification('Atualização do Sistema', {
      body: message,
      icon: '/icon-192.png',
      tag: 'system-update',
      data: { type: 'system' }
    });
  }

  async notifyCustomMessage(title: string, message: string, type: 'info' | 'success' | 'warning' | 'urgent' = 'info'): Promise<void> {
    const colors = {
      info: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      urgent: '#EF4444'
    };

    await this.sendNotification(title, {
      body: message,
      icon: '/icon-192.png',
      tag: `custom-${type}`,
      data: { type: 'custom', category: type }
    });
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Hook for React components
export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const checkSupport = async () => {
      setIsSupported('Notification' in window && 'serviceWorker' in navigator);
      setPermission(notificationService.getPermissionStatus());
      
      // Initialize service
      await notificationService.initialize();
    };

    checkSupport();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const granted = await notificationService.initialize();
    setPermission(notificationService.getPermissionStatus());
    return granted;
  };

  const sendNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
    await notificationService.sendNotification(title, options);
  };

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    notifyNewDocument: notificationService.notifyNewDocument.bind(notificationService),
    notifyNewIdea: notificationService.notifyNewIdea.bind(notificationService),
    notifySystemUpdate: notificationService.notifySystemUpdate.bind(notificationService),
    notifyCustomMessage: notificationService.notifyCustomMessage.bind(notificationService)
  };
}

// React import for the hook
import { useState, useEffect } from 'react';
