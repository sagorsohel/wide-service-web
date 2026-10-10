import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Layers, Sparkles, Smartphone, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-bold text-xl tracking-tight">Wide Service</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Sign In</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-200 dark:border-blue-900 mb-8">
          <Sparkles className="w-4 h-4" /> Next-Gen Multi-Platform Ecosystem
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl text-slate-900 dark:text-white mb-6">
          Wide Service Web & Platform
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Powered by Next.js and shadcn/ui. Seamlessly interconnected with the Wide Service Admin Panel and Mobile App.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            Explore Dashboard <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline">
            Documentation
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <CardTitle>wide-service-app</CardTitle>
              <CardDescription>React Native Expo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cross-platform mobile application powered by Expo SDK, offering fast native performance on iOS & Android.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <CardTitle>wide-service-admin</CardTitle>
              <CardDescription>React + React Router + shadcn</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                High-performance administration dashboard with client-side routing and prebuilt design components.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <CardTitle>wide-service-web</CardTitle>
              <CardDescription>Next.js + shadcn</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Fast, SEO-optimized public portal built with Next.js App Router and tailored Tailwind & shadcn UI.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500">
        &copy; 2026 Wide Service. All rights reserved.
      </footer>
    </div>
  );
}
