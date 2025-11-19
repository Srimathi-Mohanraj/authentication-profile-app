import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-2">
          Welcome to the Landing Page
        </h1>
        <p className="text-gray-600">
          Only logged-in users can see this page.
        </p>
      </main>
    </div>
  );
}
