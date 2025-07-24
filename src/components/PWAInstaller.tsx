'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotifications } from '@/lib/notifications'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const { isSupported, permission, requestPermission } = useNotifications()

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    setIsInstalled(isStandalone || isInWebAppiOS)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }
  }

  const handleNotificationPermission = async () => {
    await requestPermission()
  }

  // Don't show anything if app is already installed
  if (isInstalled) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {/* Install App Prompt */}
      {showInstallPrompt && (
        <Card className="mb-4 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#8B3F9B] text-lg flex items-center">
              <div className="w-8 h-8 bg-[#8B3F9B] rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-white">lu</span>
              </div>
              Instalar App
            </CardTitle>
            <CardDescription>
              Instale o app LU Digital para uma experiência melhor
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex space-x-2">
              <Button
                onClick={handleInstallClick}
                className="flex-1 bg-[#8B3F9B] hover:bg-[#7A3589] text-white text-sm"
              >
                Instalar
              </Button>
              <Button
                onClick={() => setShowInstallPrompt(false)}
                variant="outline"
                className="flex-1 text-sm"
              >
                Agora não
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Permission Prompt */}
      {isSupported && permission === 'default' && (
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#8B3F9B] text-lg flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.07 13H2.05L2 12.95c-.02-.02-.02-.06 0-.08L2.05 12.87H4.07c.03 0 .05.02.05.05v.03c0 .03-.02.05-.05.05zM4.07 10H2.05L2 9.95c-.02-.02-.02-.06 0-.08L2.05 9.87H4.07c.03 0 .05.02.05.05v.03c0 .03-.02.05-.05.05z" />
              </svg>
              Notificações
            </CardTitle>
            <CardDescription>
              Receba notificações sobre novos documentos e atualizações
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex space-x-2">
              <Button
                onClick={handleNotificationPermission}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
              >
                Permitir
              </Button>
              <Button
                onClick={() => {/* Hide notification prompt */}}
                variant="outline"
                className="flex-1 text-sm"
              >
                Não agora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
