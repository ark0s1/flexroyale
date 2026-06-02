export default function Loading() {
  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-pulse space-y-4">
        {/* Main profile skeleton */}
        <div className="h-32 bg-[#26231E] border border-line" />
        {/* Detailed breakdown skeleton */}
        <div className="h-48 bg-[#26231E] border border-line" />
        {/* Grid skeleton */}
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-[#26231E] border border-line" />
          <div className="h-24 bg-[#26231E] border border-line" />
          <div className="h-24 bg-[#26231E] border border-line" />
        </div>
      </div>
    </div>
  );
}
