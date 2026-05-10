import React from "react";
import { Link } from "react-router-dom";
import { Compass, EyeOff } from "lucide-react";

export function Login() {
  return (
    <div className="bg-surface-background min-h-screen w-full flex antialiased">
      <div className="hidden lg:flex lg:flex-1 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/30 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16">
          <p className="font-display text-5xl font-bold text-surface-canvas mb-4 drop-shadow-md">
            Discover the world with effortless planning.
          </p>
          <p className="font-body text-lg text-surface-canvas/90 max-w-xl drop-shadow-sm">
            Stitch together flights, stays, and experiences into a single, cohesive journey. Your next adventure awaits.
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center bg-surface-canvas px-8 py-12 lg:px-24">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <Compass className="text-primary w-8 h-8" />
              <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">Traveloop</h1>
            </div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Welcome back</h2>
            <p className="font-body text-base text-text-secondary">Please enter your details to sign in.</p>
          </div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            <div>
              <label className="block font-label text-xs font-semibold tracking-wider text-text-primary mb-2 uppercase" htmlFor="email">Email</label>
              <input className="w-full px-4 py-3 border border-border-subtle rounded-lg font-body text-sm text-on-surface bg-surface-canvas focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" id="email" name="email" placeholder="Enter your email" required type="email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-label text-xs font-semibold tracking-wider text-text-primary uppercase" htmlFor="password">Password</label>
                <a className="font-label text-xs font-semibold text-primary hover:text-surface-tint transition-colors" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <input className="w-full px-4 py-3 border border-border-subtle rounded-lg font-body text-sm text-on-surface bg-surface-canvas focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12" id="password" name="password" placeholder="••••••••" required type="password" />
                <button className="absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary hover:text-text-primary focus:outline-none" type="button">
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-label text-sm font-semibold hover:bg-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" type="submit">
              Login
            </button>
          </form>
          <div className="mt-8 mb-8 flex items-center justify-center">
            <div className="flex-grow border-t border-border-subtle"></div>
            <span className="px-4 font-label text-[11px] font-medium text-text-secondary uppercase">Or</span>
            <div className="flex-grow border-t border-border-subtle"></div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 bg-surface-canvas border border-border-subtle text-text-primary py-3 rounded-lg font-label text-sm font-semibold hover:bg-surface-background transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-subtle" type="button">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Sign in with Google
          </button>
          <p className="mt-8 text-center font-body text-sm text-text-secondary">
            Don't have an account? <Link className="font-label text-sm font-semibold text-primary hover:text-surface-tint hover:underline transition-all" to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
