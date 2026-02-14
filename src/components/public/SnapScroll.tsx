'use client'

export default function SnapScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-y-auto snap-y snap-proximity scroll-smooth">
      {children}
    </div>
  )
}
