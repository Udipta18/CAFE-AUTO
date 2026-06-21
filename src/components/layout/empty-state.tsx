import { FileText } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        {icon || <FileText className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
