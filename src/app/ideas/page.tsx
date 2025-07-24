'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function IdeasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [isAddingIdea, setIsAddingIdea] = useState(false)
  const [newIdea, setNewIdea] = useState({
    title: '',
    url: '',
    description: '',
    platform: ''
  })

  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: 'Campanha Nike - Just Do It Evolution',
      description: 'Evolução da campanha icônica com foco em diversidade e inclusão',
      platform: 'YouTube',
      url: 'https://youtube.com/watch?v=example1',
      addedAt: '2024-01-15',
      tags: ['motivacional', 'esporte', 'diversidade']
    },
    {
      id: 2,
      title: 'Trend de Stories Interativos - Polls e Quiz',
      description: 'Como usar enquetes e quizzes para aumentar engajamento',
      platform: 'Instagram',
      url: 'https://instagram.com/p/example2',
      addedAt: '2024-01-14',
      tags: ['interativo', 'stories', 'engajamento']
    },
    {
      id: 3,
      title: 'Viral Dance Challenge - #MoveWithUs',
      description: 'Challenge de dança que viralizou com mais de 10M de visualizações',
      platform: 'TikTok',
      url: 'https://tiktok.com/@example3',
      addedAt: '2024-01-12',
      tags: ['viral', 'dança', 'challenge']
    },
    {
      id: 4,
      title: 'Storytelling Emocional - Dove Real Beauty',
      description: 'Como criar conexão emocional através de histórias reais',
      platform: 'YouTube',
      url: 'https://youtube.com/watch?v=example4',
      addedAt: '2024-01-10',
      tags: ['storytelling', 'emocional', 'beleza']
    },
    {
      id: 5,
      title: 'UGC Campaign - #ShareYourStory',
      description: 'Campanha de conteúdo gerado pelo usuário com grande alcance',
      platform: 'Instagram',
      url: 'https://instagram.com/p/example5',
      addedAt: '2024-01-08',
      tags: ['ugc', 'comunidade', 'autenticidade']
    },
    {
      id: 6,
      title: 'Micro-Influencer Strategy',
      description: 'Estratégia eficaz usando micro-influenciadores locais',
      platform: 'TikTok',
      url: 'https://tiktok.com/@example6',
      addedAt: '2024-01-05',
      tags: ['influencer', 'local', 'autenticidade']
    }
  ])

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterPlatform === 'all' || idea.platform === filterPlatform
    return matchesSearch && matchesFilter
  })

  const handleOpenIdea = (url: string) => {
    window.open(url, '_blank')
  }

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard'
  }

  const detectPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('instagram.com')) return 'Instagram'
    if (url.includes('tiktok.com')) return 'TikTok'
    return 'Outro'
  }

  const handleAddIdea = () => {
    if (newIdea.title && newIdea.url) {
      const platform = detectPlatform(newIdea.url)
      const idea = {
        id: ideas.length + 1,
        title: newIdea.title,
        description: newIdea.description,
        platform: platform,
        url: newIdea.url,
        addedAt: new Date().toISOString().split('T')[0],
        tags: []
      }
      setIdeas([idea, ...ideas])
      setNewIdea({ title: '', url: '', description: '', platform: '' })
      setIsAddingIdea(false)
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return 'bg-red-100 text-red-800'
      case 'Instagram':
        return 'bg-pink-100 text-pink-800'
      case 'TikTok':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4F0] to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToDashboard}
                variant="ghost"
                size="sm"
                className="text-[#8B3F9B] hover:bg-[#8B3F9B]/10"
              >
                ← Voltar
              </Button>
              <div className="flex items-center justify-center w-10 h-10 bg-[#F5B800] rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#8B3F9B]">Banco de Ideias</h1>
                <p className="text-sm text-gray-600">Suas inspirações e referências</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#8B3F9B] mb-2">
                Suas Ideias
              </h2>
              <p className="text-gray-600">
                Colete e organize suas inspirações de diferentes plataformas.
              </p>
            </div>
            <Dialog open={isAddingIdea} onOpenChange={setIsAddingIdea}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0 bg-[#F5B800] hover:bg-[#E5A600] text-white">
                  + Adicionar Ideia
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-[#8B3F9B]">Adicionar Nova Ideia</DialogTitle>
                  <DialogDescription>
                    Adicione um link de inspiração do YouTube, Instagram ou TikTok.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Campanha criativa da Nike"
                      value={newIdea.title}
                      onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={newIdea.url}
                      onChange={(e) => setNewIdea({ ...newIdea, url: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Por que esta ideia é interessante..."
                      value={newIdea.description}
                      onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingIdea(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddIdea}
                    className="bg-[#F5B800] hover:bg-[#E5A600] text-white"
                    disabled={!newIdea.title || !newIdea.url}
                  >
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-[#8B3F9B]">Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar ideias, tags ou descrições..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300 focus:border-[#8B3F9B] focus:ring-[#8B3F9B]"
                />
              </div>
              <div className="sm:w-48">
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="border-gray-300 focus:border-[#8B3F9B] focus:ring-[#8B3F9B]">
                    <SelectValue placeholder="Filtrar por plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as plataformas</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-[#8B3F9B] text-lg mb-2 group-hover:text-[#7A3589] transition-colors">
                      {idea.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-3">
                      {idea.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <Badge variant="secondary" className={getPlatformColor(idea.platform)}>
                    {idea.platform}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(idea.addedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {idea.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleOpenIdea(idea.url)}
                  className="w-full bg-[#F5B800] hover:bg-[#E5A600] text-white transition-colors"
                >
                  Ver Inspiração
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredIdeas.length === 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma ideia encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Tente ajustar os filtros ou adicione uma nova ideia.
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterPlatform('all')
                  }}
                  variant="outline"
                  className="border-[#8B3F9B] text-[#8B3F9B] hover:bg-[#8B3F9B] hover:text-white"
                >
                  Limpar Filtros
                </Button>
                <Button
                  onClick={() => setIsAddingIdea(true)}
                  className="bg-[#F5B800] hover:bg-[#E5A600] text-white"
                >
                  Adicionar Ideia
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-[#8B3F9B] mb-1">
                {ideas.length}
              </div>
              <div className="text-sm text-gray-600">Total de Ideias</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {ideas.filter(i => i.platform === 'YouTube').length}
              </div>
              <div className="text-sm text-gray-600">YouTube</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-pink-600 mb-1">
                {ideas.filter(i => i.platform === 'Instagram').length}
              </div>
              <div className="text-sm text-gray-600">Instagram</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {ideas.filter(i => i.platform === 'TikTok').length}
              </div>
              <div className="text-sm text-gray-600">TikTok</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
