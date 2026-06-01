"use client";

import { Component, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(255,75,75,0.08)" }}>
            <span className="text-[28px]">⚠</span>
          </div>
          <h3 className="text-[16px] font-extrabold mb-2" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>
            Something went wrong
          </h3>
          <p className="text-[13px] font-medium mb-4 text-center max-w-xs" style={{ color: "#6B5D52" }}>
            {this.state.error?.message?.slice(0, 100) || "An unexpected error occurred."}
          </p>
          <button onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #58CC02, #46A302)", boxShadow: "0 4px 12px rgba(88,204,2,0.25)" }}>
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
