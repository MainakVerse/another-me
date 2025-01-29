'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wand2, Download } from 'lucide-react'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useTrialLimit } from '@/hooks/useTrialLimit'

export default function Home() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{url: string} | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getTrialData, updateTrialData, getTimeUntilReset } = useTrialLimit();
  const [trialInfo, setTrialInfo] = useState({ triesLeft: 1, timeUntilReset: '' });

  useEffect(() => {
    const updateTrialInfo = () => {
      const data = getTrialData();
      setTrialInfo({
        triesLeft: data.triesLeft,
        timeUntilReset: getTimeUntilReset()
      });
    };

    updateTrialInfo();
    const interval = setInterval(updateTrialInfo, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trialData = getTrialData();
    if (trialData.triesLeft <= 0) {
      setError(`Daily limit reached. Next try available in ${getTimeUntilReset()}`);
      return;
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate-memoji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate avatar')
      }

      setResult(data.result)
      updateTrialData(); // Update trial count after successful generation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!result?.url) return;

    try {
      const response = await fetch(result.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `avatar-${Date.now()}.png`; // Unique filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download avatar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* <Navbar /> */}
      
      <div className="w-full border-b border-gray-800 bg-blue-700 backdrop-blur-sm relative z-10">
        <div className="container max-w-6xl mx-auto px-4 py-2">
          <p className="text-center text-sm text-white-400">
            If Trials End, don&apos;t freak. Open in an Incognito or Private Window. Keep generating endlessly 
          </p>
        </div>
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Another Me
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Customize your imagination with a powerful prompt 
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg shadow-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
                Create Avatar
              </CardTitle>
              
              <div className="mt-2 text-sm">
                {trialInfo.triesLeft === 0 ? (
                  <div className="text-yellow-300 bg-yellow-500/10 px-3 py-2 rounded-md">
                    Next try available in {trialInfo.timeUntilReset}
                  </div>
                ) : (
                  <div className="text-blue-300 bg-blue-500/10 px-3 py-2 rounded-md">
                    {trialInfo.triesLeft} {trialInfo.triesLeft === 1 ? 'try' : 'tries'} remaining today
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="input" className="text-gray-300">Here goes your creative spell 💫</Label>
                  <Input
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your message..."
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !input || trialInfo.triesLeft === 0} 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Wand2 className="mr-2 h-5 w-5 animate-spin text-yellow-300" />
                      <span className="text-yellow-300">Imagining...</span>
                    </div>
                  ) : trialInfo.triesLeft === 0 ? (
                    <div className="flex items-center justify-center">
                      <span className="text-gray-400">Try again in {trialInfo.timeUntilReset}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Wand2 className="mr-2 h-5 w-5 text-yellow-300" />
                      <span>Generate Avatar</span>
                    </div>
                  )}
                </Button>
                <p className="text-center bg-green-300 border rounded-md text-white-400">
            If Trials End, don&apos;t freak.<br/> Open in an Incognito or Private Window.<br/> Keep generating endlessly 
          </p>
                {trialInfo.triesLeft === 1 && (
                  <p className="text-xs text-center text-gray-400">
                    This is your last try for today
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg shadow-blue-500/20 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">Avatar Result</CardTitle>
              
            </CardHeader>
            <CardContent className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                  <div className="text-center p-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    <p className="mt-2 text-sm text-purple-300">Painting...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {result && (
                <div className="p-4 border border-white/20 rounded-lg overflow-hidden space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <Image
                      src={result.url}
                      alt="Generated Avatar"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <div className="flex items-center justify-center">
                      <Download className="mr-2 h-5 w-5" />
                      <span>Download Avatar</span>
                    </div>
                  </Button>
                </div>
              )}

              {!loading && !error && !result && (
                <div className="h-[400px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-500/50 rounded-lg bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                  <p className="text-center">
                    <span className="block text-3xl mb-2">✨</span>
                        Your 3D Avatar will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}

