import Link from "next/link";

export function NdaCta({ context }: { context?: string }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 my-8">
      <h3 className="font-semibold text-lg mb-2">
        Ready to create your NDA?
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {context ||
          "Generate a professionally drafted NDA in under 5 minutes. Customized to your needs, with built-in e-signature."}
      </p>
      <Link
        href="/create"
        className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Your NDA &mdash; $29
      </Link>
    </div>
  );
}

export function NdaPreview() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 my-6 shadow-sm">
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">
        NDA Preview
      </div>
      <div className="space-y-2 text-sm text-gray-500">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-2/3 mt-4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-full" />
      </div>
      <p className="text-xs text-gray-400 mt-4 italic">
        Your NDA is customized based on party details, jurisdiction, and use case.
      </p>
    </div>
  );
}
