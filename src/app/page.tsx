import { auth } from "@/lib/auth";
import { Header } from "@/components/ui/header";
import { LandingContent } from "@/components/landing-content";
import { Dashboard } from "@/components/dashboard";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {session?.user ? <Dashboard /> : <LandingContent />}
      </main>
    </div>
  );
}
