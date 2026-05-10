import React from "react";
import { Link } from "react-router-dom";
import { PlaneTakeoff, EyeOff } from "lucide-react";

export function SignUp() {
  return (
    <div className="bg-surface-background min-h-screen flex text-on-surface font-body">
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img alt="Scenic landscape" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop" />
        <div className="relative z-20 flex flex-col justify-end p-8 h-full w-full max-w-2xl text-on-primary">
          <div className="flex items-center gap-2 mb-4">
            <PlaneTakeoff className="w-8 h-8 text-white" />
            <span className="font-headline text-3xl tracking-tight text-white font-bold">Traveloop</span>
          </div>
          <h1 className="font-display text-5xl font-bold mb-3 text-white">Start your next great adventure.</h1>
          <p className="font-title text-xl opacity-90 text-white">Join thousands of travelers who plan, stitch, and experience the world with effortless precision.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-surface-canvas relative">
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-primary">
          <PlaneTakeoff className="w-7 h-7" />
          <span className="font-headline text-2xl font-bold">Traveloop</span>
        </div>
        <div className="w-full max-w-[480px] mt-12 lg:mt-0">
          <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Create Account</h2>
            <p className="font-body text-base text-on-surface-variant">Fill in your details to get started.</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className="block font-label text-xs font-semibold text-on-surface mb-1" htmlFor="firstName">First name</label>
                <input className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-surface-canvas text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" id="firstName" placeholder="e.g. Jane" type="text" />
              </div>
              <div className="w-full">
                <label className="block font-label text-xs font-semibold text-on-surface mb-1" htmlFor="lastName">Last name</label>
                <input className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-surface-canvas text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" id="lastName" placeholder="e.g. Doe" type="text" />
              </div>
            </div>
            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1" htmlFor="email">Email address</label>
              <input className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-surface-canvas text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" id="email" placeholder="name@example.com" type="email" />
            </div>
            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <input className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-surface-canvas text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow pr-10" id="password" placeholder="••••••••" type="password" />
                <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-primary transition-colors" type="button">
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-1 text-[12px] text-text-secondary">Must be at least 8 characters.</p>
            </div>
            <div className="flex items-start gap-3 pt-3">
              <div className="flex items-center h-5">
                <input className="w-4 h-4 border-outline rounded bg-surface-canvas text-primary focus:ring-primary focus:ring-2" id="terms" type="checkbox" />
              </div>
              <label className="font-body text-sm text-on-surface-variant" htmlFor="terms">
                I agree to the <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a> and <a className="text-primary hover:underline font-medium" href="#">Privacy Policy</a>.
              </label>
            </div>
            <div className="pt-3">
              <button className="w-full py-3 px-6 bg-primary text-on-primary font-label text-sm font-semibold rounded-lg hover:bg-surface-tint transition-colors flex justify-center items-center" type="submit">
                Create Account
              </button>
            </div>
          </form>
          <div className="mt-6 text-center font-body text-sm text-on-surface-variant">
            Already have an account? <Link className="text-primary font-medium hover:underline" to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
