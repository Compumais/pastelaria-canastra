import type { ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
};

export function PageContent({ children }: PageContentProps) {
  return (
    <div className="max-w-screen min-h-screen w-full h-full bg-gray-300 text-gray-900">
      { children }
    </div>
  )
}