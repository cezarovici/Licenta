interface ProfilePlaceholderProps {
  loading: boolean;
  error: string;
}

export default function ProfilePlaceholder({
  loading,
  error,
}: ProfilePlaceholderProps) {
  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl text-gray-500 animate-pulse">
          Loading Profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center bg-red-50">
        <p className="text-xl text-red-600">Could not load profile</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  return null;
}
