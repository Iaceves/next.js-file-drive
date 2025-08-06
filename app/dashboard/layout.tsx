import { SideNav } from "./side-nav";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex gap-8">
        <SideNav />
        <div className="w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
