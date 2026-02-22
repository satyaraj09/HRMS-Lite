export default function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{message}</div>
  );
}
