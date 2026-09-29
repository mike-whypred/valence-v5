export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="grid gap-8">
      <div className="skeleton h-10 w-72 rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="skeleton h-80 rounded-2xl lg:col-span-8" />
        <div className="grid gap-4 lg:col-span-4">
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-52 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
