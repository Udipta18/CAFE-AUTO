import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button render={<Link href="/" />}>Go to Dashboard</Button>
    </div>
  );
}
