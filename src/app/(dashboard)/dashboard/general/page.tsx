import { getCurrentUser } from '@/lib/utils/session';

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="w-full">
      <div className="flex flex-col px-4 py-6 pt-8 mb-4 space-y-3 bg-white border-b border-gray-200 sm:px-16"></div>
    </div>
  );
}
