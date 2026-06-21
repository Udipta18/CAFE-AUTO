import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
