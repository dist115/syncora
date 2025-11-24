import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';

export function PreviewCard({
  src,
  onRemove,
}: {
  src: string;
  onRemove?: (value: string) => void;
}) {
  return (
    <div
      className={`uploader-preview-card relative grid items-center w-full gap-4 overflow-hidden ${
        onRemove ? 'grid-cols-[1fr_minmax(0,36px)]' : 'grid-cols-1'
      }`}
    >
      <div className="z-[1] items-center w-full gap-6 grid grid-cols-[48px_1fr]">
        <div className="flex items-center justify-center w-32 h-auto p-2 overflow-hidden rounded shrink-0 bg-steel-200 dark:bg-steel-600">
          <Image
            src={src}
            alt={src ?? 'Uploaded Image'}
            className="w-full h-auto"
            width={200}
            height={200}
          />
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          className="p-2 text-xs text-gray-400 transition-colors rounded dark:text-steel-200 dark:hover:bg-steel-500/60 hover:bg-steel-100"
          onClick={() => onRemove(src)}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
