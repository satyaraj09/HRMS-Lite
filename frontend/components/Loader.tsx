export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-2">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-lg">Loading...</p>
    </div>
  );
}
