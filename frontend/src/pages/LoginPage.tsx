import { Map, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-line bg-paper p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-white shadow-md">
            <Map className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-ink">BhoomiSetu</h2>
            <p className="mt-1 text-sm text-text-mute">
              National Land Acquisition & Management System
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-md bg-sky-50 px-3 py-2 text-sm text-sky-800 border border-sky-100">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Government Authorized Personnel Only
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-ink mb-1">
                Officer ID
              </label>
              <Input
                id="userId"
                type="text"
                placeholder="e.g., LAO-2026-001"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-mute">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-accent hover:text-accent/80">
                Forgot password?
              </a>
            </div>
          </div>

          <Button type="submit" className="w-full bg-accent text-white hover:bg-accent/90" size="lg">
            Sign In to Dashboard
          </Button>
        </form>
        
        <div className="text-center text-xs text-text-faint mt-4">
          Ministry of Rural Development • Department of Land Resources
        </div>
      </div>
    </div>
  );
}
