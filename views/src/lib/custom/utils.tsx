

export function ErrorMessage({ message }: { message?: string }) {
  return <p className="text-red-600 text-xs font-medium">{message}</p>;
}

