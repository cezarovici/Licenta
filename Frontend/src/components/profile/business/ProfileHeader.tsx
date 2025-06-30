interface ProfileHeaderProps {
  title: string;
  subtitle: string;
}

export default function ProfileHeader({ title, subtitle }: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-heading">{title}</h1>
      <p className="text-secondary mt-1">{subtitle}</p>
    </div>
  );
}
