import { Settings } from "@/lib/Settings";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await Settings();
  return {
    title: settings.site || "Welcome to CMS",
    description: settings.title || "Content Management System",
  };
}

export default async function HomePage() {
  const settings = await Settings();
  return (
    <div className="">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {settings.site || "Welcome to CMS"}
          </h1>
          <p className="text-xl text-gray-600">
            {settings.title || "Content Management System"}
          </p>
        </div>
      </div>
    </div>
  );
}
