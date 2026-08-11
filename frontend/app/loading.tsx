export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading Dashboard...</p>
      </div>
    </div>
  )
}
