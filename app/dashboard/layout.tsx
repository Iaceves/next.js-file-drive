import { ConvexClientProvider } from "../ConvexClientProvider";
import Footer from "../footer";
import { SideNav } from "./side-nav";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col  justify-between p-24">
      <div className="flex gap-8">
        <ConvexClientProvider>
        <SideNav />
        <div className="w-full">
          {children}
          <Footer />
        </div>
        </ConvexClientProvider>
      </div>
    </main>
  );
}
