import { forwardRef, ReactNode, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';
import { DropzoneOptions, FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { getFileType } from '@/lib/utils/getFileType';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';

type VariantTypes = 'avatar' | 'box';
function DisplayPreview({
  file,
  onRemove,
  multiple = false,
  children,
  defaultValue,
  variant = 'box',
}: {
  file?: FileWithPath;
  onRemove: (value: string) => void;
  multiple?: boolean;
  children?: ReactNode;
  defaultValue?: any;
  variant?: VariantTypes;
}) {
  const iconType = getFileType(file!) as FileIconType;

  return (
    <div className="uploader-preview-card relative items-center w-full gap-4 overflow-hidden grid grid-cols-[1fr_36px]">
      <div className="z-[1] flex items-center w-full gap-6">
        {typeof file === 'undefined' && defaultValue && (
          <div
            className={cn(
              'flex items-center justify-center overflow-hidden shrink-0 bg-steel-200 dark:bg-steel-600/30 relative',
              variant === 'avatar' ? 'w-12 h-12 rounded-full' : 'w-32 h-auto'
            )}
          >
            <Image alt="" src={defaultValue} className="w-full h-auto" fill />
          </div>
        )}

        {iconType && iconType === 'image' ? (
          <div
            className={cn(
              'flex items-center justify-center overflow-hidden shrink-0 bg-steel-200 dark:bg-steel-600 relative',
              variant === 'avatar'
                ? 'w-12 h-12 rounded-full'
                : 'w-12 h-12 p-2 rounded'
            )}
            key={file?.name}
          >
            <Image
              alt={file?.name ?? 'Uploaded Image'}
              src={(file as any)?.preview}
              className="w-full h-auto"
              fill
              onLoad={() => {
                URL.revokeObjectURL((file as any)?.preview);
              }}
            />
          </div>
        ) : (
          <>
            {variant !== 'avatar' && (
              <div className="inline-flex shrink-0">
                <DynamicFileIcon
                  className="w-12 h-12 text-steel-400 dark:text-steel-200"
                  iconType={iconType}
                />
              </div>
            )}
          </>
        )}

        {variant === 'avatar' && !multiple ? (
          children
        ) : (
          <span
            className="inline-block overflow-hidden text-sm font-medium cursor-default text-steel-700 dark:text-steel-100 text-ellipsis"
            title={file?.name}
          >
            {file?.name}
          </span>
        )}
      </div>

      {file?.name && (
        <button
          type="button"
          className="p-2 text-xs transition-colors rounded text-steel-400 dark:text-steel-200 hover:bg-steel-100 dark:hover:bg-steel-500/60"
          onClick={() => onRemove(file?.name)}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

interface Props extends DropzoneOptions {
  reset?: boolean;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  variant?: VariantTypes;
  onChange?: any;
  isUploading?: boolean;
}
type Ref = HTMLInputElement;
interface FileWithPreview extends FileWithPath {
  preview?: any;
}

/**
 * React Dropzone Uploader
 *
 * @param {string} variant default type is `box`. Variant type `avatar` will only work for single file upload. If `multiple` is true then it will revert back to `box` variant.
 * @param {any} defaultValue use this prop only with the variant type `avatar` to display the default preview. Won't work with `box` variant.
 * @param {string} placeholder use this prop to change the default uploader description.
 * @param {boolean} reset default type is `false`. If needed then conditionally use this prop to reset the local uploaded files state after the mutation is success.
 *
 * @see check the [react dropzone documentation](https://react-dropzone.js.org/) for all the supported props
 * */

export const Uploader = forwardRef<Ref, Props>(
  (
    {
      onChange,
      multiple = false,
      className,
      placeholder,
      defaultValue,
      variant = 'box',
      reset = false,
      disabled = false,
      isUploading = false,
      ...inputProps
    },
    _ref
  ) => {
    const [files, setFiles] = useState<FileWithPreview[]>();
    const onDrop = useCallback(onChange, [onChange]);
    const { getRootProps, getInputProps } = useDropzone({
      multiple,
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
        onDrop(acceptedFiles);
      },
      ...inputProps,
    });

    function handleRemove(fileName: string) {
      const fileList = files?.filter((file) => file?.name !== fileName);
      setFiles(fileList);
      onDrop(fileList);
    }

    useEffect(() => {
      if (reset) {
        setFiles([]);
        onDrop([]);
      }
    }, [reset, onDrop]);

    const acceptedFileItems = files?.map((file: FileWithPath) => (
      <DisplayPreview
        key={file?.path}
        file={file}
        onRemove={handleRemove}
        multiple={multiple}
        defaultValue={defaultValue}
        variant={variant}
      />
    ));

    useEffect(() => {
      return () => files?.forEach((file) => URL.revokeObjectURL(file?.preview));
    }, [files]);

    if (variant === 'avatar' && !multiple) {
      return (
        <>
          <DisplayPreview
            key={files?.[0]?.path}
            file={files?.[0]}
            defaultValue={defaultValue}
            onRemove={handleRemove}
            variant={variant}
            multiple={multiple}
          >
            <div className="grid grid-cols-[85px_1fr] items-center gap-6 w-full">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button disabled={disabled}>Choose</Button>
              </div>

              <p className="overflow-hidden col-span-full [@media(min-width:460px)]:col-span-1 text-sm font-medium text-steel-500 dark:text-steel-300 text-ellipsis">
                {files?.[0]?.name ? files?.[0]?.name : placeholder}
              </p>
            </div>
          </DisplayPreview>
        </>
      );
    }

    return (
      <>
        <section className="flex items-center w-full bg-steel-50/30 dark:bg-steel-600/20 react-dropzone-uploader rounded-2xl">
          <div
            className="component-wrapper border-dashed border-2 border-steel-200 dark:border-steel-600 py-12 w-full h-full rounded-2xl gap-3.5 flex flex-col justify-center items-center cursor-pointer focus:outline-none"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <p className="text-sm font-medium text-center text-steel-500 dark:text-steel-300 placeholder-helper-text">
              {placeholder ?? 'Drag and drop files here'}
            </p>
            <span className="text-sm font-medium text-center text-steel-400 static-helper-text">
              Or
            </span>
            <Button>Browse File</Button>
          </div>
        </section>

        {!isUploading && files && files?.length > 0 && (
          <aside className="flex flex-col w-full gap-5 preview-wrapper mt-7">
            {acceptedFileItems}
          </aside>
        )}
      </>
    );
  }
);

Uploader.displayName = 'Uploader';
