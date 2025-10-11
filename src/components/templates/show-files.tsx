'use client';

import { useEffect, useState } from 'react';
import {
  type CompleteBreadcrumbs,
  type CompleteFile,
  type Tags,
} from '@/db/schema';
import { isEmpty } from 'lodash';
import { User } from 'lucia';
import { RiArrowDownSLine, RiCheckLine, RiFilterLine } from 'react-icons/ri';
import { ActionIcon, Button, Drawer, Dropdown } from 'rizzui';

import { FILE_SORT_OPTIONS, ORDER_OPTIONS } from '@/config/sort-options';
import { cn } from '@/lib/utils/cn';
import { useFilesLayout } from '@/hooks/useFilesLayout';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useQueryParams from '@/hooks/useQueryParam';
import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { SearchBox } from '@/components/atoms/search-box';
import { Separator } from '@/components/atoms/separator';
import { Breadcrumbs } from '@/components/molecules/breadcrumbs/breadcrumbs';
import { DrawerHeader } from '@/components/molecules/drawer-header';
import { FileDropdown } from '@/components/molecules/file-dropdown';
import {
  FileLayoutSwitcher,
  FilesLayoutType,
} from '@/components/organisms/file-layout-switcher';
import { FoldersFiles } from '@/components/organisms/folders-files';
import { ManageTagsButton } from '@/components/organisms/manage-tags-button';
import { TrashSelectedButton } from '@/components/organisms/trash-selected-button';

const filterParams = ['search', 'tag', 'sort', 'order', 'page', 'type'];

const fileType = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Folders',
    value: 'folder',
  },
  {
    label: 'Image',
    value: 'image',
  },
  {
    label: 'Video',
    value: 'video',
  },
  {
    label: 'Audio',
    value: 'audio',
  },
  {
    label: 'Doc',
    value: 'doc',
  },
  {
    label: 'Docx',
    value: 'docx',
  },
  {
    label: 'Xlsx',
    value: 'xlsx',
  },
  {
    label: 'Pdf',
    value: 'pdf',
  },
  {
    label: 'Text',
    value: 'txt',
  },
  {
    label: 'Zip',
    value: 'zip',
  },
];

export const ShowFiles = ({
  files,
  totalFiles,
  folders,
  user,
  tags,
  parentId,
  breadcrumbs,
  enableFileUpload = true,
  permissions,
  currentTeam,
  availableStorage,
  defaultLayout,
}: {
  files: CompleteFile[];
  totalFiles: number;
  folders: CompleteFile[];
  user: User;
  tags: Tags[];
  parentId?: string | null;
  breadcrumbs?: CompleteBreadcrumbs[];
  enableFileUpload?: boolean;
  permissions?: any;
  currentTeam?: any;
  availableStorage?: number;
  defaultLayout?: 'grid' | 'list';
}) => {
  const is2xl = useMediaQuery('( min-width: 1536px )');
  const [selectedFileFolderIds, setSelectedFileFolderIds] = useState<string[]>(
    []
  );
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [filterVisibility, setFilterVisibility] = useState<boolean>(false);
  const { removeQueryParams, setQueryParams, queryParams } = useQueryParams();
  const search = queryParams.search ? queryParams.search : '';
  const tagOptions = tags.map((tag) => ({
    label: tag.label,
    value: tag.slug,
  }));

  const { layout } = useFilesLayout();
  const LAYOUT = layout ?? defaultLayout;

  const currentTag = queryParams.tag
    ? tagOptions.find((tag) => tag.value === queryParams.tag)
    : null;

  const currentType = queryParams.type
    ? fileType.find((type) => type.value === queryParams.type)
    : null;

  const currentOrder = queryParams.order
    ? ORDER_OPTIONS.find((order) => order.value === queryParams.order)
    : ORDER_OPTIONS[1];

  const currentSort = queryParams.sort
    ? FILE_SORT_OPTIONS.find((sort) => sort.value === queryParams.sort)
    : FILE_SORT_OPTIONS[2];

  const toggleClearBtn = filterParams.some((key) => {
    return key in queryParams;
  });
  useEffect(() => {
    setSelectedFileFolderIds([]);
  }, [files]);

  useEffect(() => {
    setFilterVisibility(false);
  }, [is2xl]);

  return (
    <Flex direction="col" align="stretch" className="gap-0">
      <Flex className="gap-6 mb-3 lg:mb-8 flex-col sm:flex-row" justify="start">
        <PageHeader
          title="Manage Files"
          description="View and manage your files and folders from here"
          descriptionClassName="hidden"
          titleClassName="text-xl"
          className="pb-0 mb-0 md:mb-0 border-b-0"
        />

        <div
          className={cn(
            'w-full sm:w-auto grid sm:flex gap-3 sm:ml-auto shrink-0 justify-end items-center',
            enableFileUpload ? ' grid-cols-1 375px:grid-cols-2' : 'grid-cols-1'
          )}
        >
          <ManageTagsButton tags={tags} />
          {enableFileUpload && (
            <FileDropdown
              user={user}
              permissions={permissions}
              parentId={parentId}
              availableStorage={availableStorage}
            />
          )}
        </div>
      </Flex>

      <Flex justify="start" direction="col" className="md:flex-row gap-3">
        <Flex
          justify="start"
          direction="col"
          className="w-full md:w-auto [@media(min-width:500px)]:flex-row"
        >
          <Flex justify="start" className="gap-3 sm:mt-4">
            <SearchBox
              className="w-full md:max-w-xs"
              name="search"
              onClear={() => {
                setQueryParams({ search: '' });
              }}
              placeholder="Search files"
              inputClassName="h-10"
              onSubmit={(search) => {
                setQueryParams({ search: search, page: 1 });
              }}
              defaultValue={search}
              queryParams={queryParams}
            />
            {filterVisibility && (
              <Flex className="gap-3">
                <Dropdown
                  placement="bottom-end"
                  className="hidden 2xl:inline-block"
                >
                  <Dropdown.Trigger>
                    <Button
                      as="span"
                      variant="outline"
                      className="w-[164px] justify-between"
                    >
                      {currentType?.label || 'Filter By: Type'}

                      <RiArrowDownSLine
                        className=" text-steel-700 dark:text-steel-200"
                        aria-hidden="true"
                        size={20}
                      />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu className="dark:bg-steel-700 w-[164px]">
                    <>
                      {isEmpty(fileType) ? (
                        <div className="relative px-5 py-8 text-sm font-medium text-center cursor-default select-none dark:text-gray-100 ">
                          Nothing found.
                        </div>
                      ) : (
                        <>
                          {fileType.map((type) => (
                            <Dropdown.Item
                              key={type.value}
                              onClick={() =>
                                setQueryParams({ type: type?.value ?? '' })
                              }
                            >
                              <Box className="w-5 mr-1.5">
                                {currentType?.value === type.value && (
                                  <RiCheckLine size={20} />
                                )}
                              </Box>
                              {type.label}
                            </Dropdown.Item>
                          ))}
                        </>
                      )}
                    </>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  placement="bottom-end"
                  className="hidden 2xl:inline-block"
                >
                  <Dropdown.Trigger>
                    <Button
                      as="span"
                      variant="outline"
                      className="min-w-[192px] justify-between"
                    >
                      {currentTag?.label || 'Filter By: Tag'}

                      <RiArrowDownSLine
                        className=" text-steel-700 dark:text-steel-200"
                        aria-hidden="true"
                        size={20}
                      />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu className="dark:bg-steel-700">
                    <>
                      {isEmpty(tagOptions) ? (
                        <div className="relative px-5 py-8 text-sm font-medium text-center cursor-default select-none dark:text-gray-100 ">
                          Nothing found.
                        </div>
                      ) : (
                        <>
                          {tagOptions.map((tag) => (
                            <Dropdown.Item
                              key={tag.value}
                              onClick={() =>
                                setQueryParams({ tag: tag?.value ?? '' })
                              }
                            >
                              <Box className="w-5 mr-1.5">
                                {currentTag?.value === tag.value && (
                                  <RiCheckLine size={20} />
                                )}
                              </Box>
                              {tag.label}
                            </Dropdown.Item>
                          ))}
                        </>
                      )}
                    </>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  placement="bottom-end"
                  className="hidden 2xl:inline-block"
                >
                  <Dropdown.Trigger>
                    <Button
                      as="span"
                      variant="outline"
                      className="min-w-[192px] justify-between"
                    >
                      Sort By: {currentSort?.label}
                      <RiArrowDownSLine
                        className=" text-steel-700 dark:text-steel-200"
                        aria-hidden="true"
                        size={20}
                      />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu className="dark:bg-steel-700">
                    {FILE_SORT_OPTIONS.map((sort) => (
                      <Dropdown.Item
                        key={sort.value}
                        onClick={() => {
                          setQueryParams({ sort: sort.value });
                        }}
                      >
                        <Box className="w-5 mr-1.5">
                          {currentSort?.value === sort.value && (
                            <RiCheckLine size={20} />
                          )}
                        </Box>
                        {sort.label}
                      </Dropdown.Item>
                    ))}
                    <Separator />
                    {ORDER_OPTIONS.map((order) => (
                      <Dropdown.Item
                        key={order.value}
                        onClick={() => {
                          setQueryParams({ order: order.value });
                        }}
                      >
                        <Box className="w-5 mr-1.5">
                          {currentOrder?.value === order.value && (
                            <RiCheckLine size={20} />
                          )}
                        </Box>
                        {order.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Flex>
            )}
            <ActionIcon
              variant={filterVisibility ? 'solid' : 'outline'}
              size="md"
              className="!w-[unset] px-3 !h-10 rounded-md hidden 2xl:inline-flex transition-[border-color] whitespace-nowrap"
              onClick={() => setFilterVisibility((prev: boolean) => !prev)}
            >
              <RiFilterLine
                className={cn(
                  'w-[18px] h-auto mr-1.5',
                  filterVisibility
                    ? 'text-primary-foreground'
                    : 'text-steel-700 dark:text-steel-400'
                )}
              />
              {filterVisibility ? 'Hide Filter' : 'Filter'}
            </ActionIcon>
            {/* this filter button will open filter drawer for small devices */}
            <ActionIcon
              size="md"
              variant={toggleClearBtn ? 'solid' : 'outline'}
              className="!w-[unset] px-3 !h-10 rounded-md inline-flex 2xl:hidden transition-[border-color]"
              onClick={() => setFilterDrawerState(true)}
            >
              <RiFilterLine
                className={cn(
                  'w-[18px] h-auto',
                  toggleClearBtn
                    ? 'text-primary-foreground'
                    : 'text-steel-700 dark:text-steel-400'
                )}
              />{' '}
              <span className="ms-1.5 hidden sm:inline-block">Filter</span>
            </ActionIcon>
          </Flex>
          {toggleClearBtn ? (
            <Button
              className="whitespace-nowrap sm:mt-4"
              onClick={() => removeQueryParams(filterParams)}
              variant="text"
            >
              Clear Filters
            </Button>
          ) : null}
        </Flex>
        <Flex
          className={cn(
            'md:w-auto md:ml-auto gap-3 sm:mt-4',
            selectedFileFolderIds.length
              ? 'justify-between sm:justify-end'
              : 'justify-end'
          )}
        >
          {!!selectedFileFolderIds.length && (
            <TrashSelectedButton
              selectedFileFolderIds={selectedFileFolderIds}
            />
          )}
          <FileLayoutSwitcher defaultLayout={LAYOUT as FilesLayoutType} />
        </Flex>
      </Flex>

      {breadcrumbs && (
        <Box className="mt-6">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Box>
      )}

      <Box className="mt-12">
        <FoldersFiles
          files={files}
          totalFiles={totalFiles}
          folders={folders}
          user={user}
          currentTeam={currentTeam}
          layout={LAYOUT}
          permissions={permissions}
          selectedFileFolderIds={selectedFileFolderIds}
          setSelectedFileFolderIds={setSelectedFileFolderIds}
        />
      </Box>
      <Drawer
        onClose={() => setFilterDrawerState(false)}
        isOpen={filterDrawerState}
        customSize={300}
      >
        <Box>
          <DrawerHeader
            title="Filter"
            onClose={() => setFilterDrawerState(false)}
          />
          <Flex direction="col" className="p-4">
            <Dropdown placement="bottom-start" className="w-full">
              <Dropdown.Trigger className="w-full">
                <Button
                  as="span"
                  variant="outline"
                  className="w-full justify-between"
                >
                  {currentType?.label || 'Filter By Type'}

                  <RiArrowDownSLine
                    className=" text-steel-700 dark:text-steel-200"
                    aria-hidden="true"
                    size={20}
                  />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu className="dark:bg-steel-700 w-[--button-width]">
                {fileType.map((type) => (
                  <Dropdown.Item
                    className="capitalize"
                    key={type.value}
                    onClick={() => setQueryParams({ type: type?.value ?? '' })}
                  >
                    <Box className="w-5 mr-1.5">
                      {currentType?.value === type.value && (
                        <RiCheckLine size={20} />
                      )}
                    </Box>
                    {type.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown placement="bottom-start" className="w-full">
              <Dropdown.Trigger className="w-full">
                <Button
                  as="span"
                  variant="outline"
                  className="w-full justify-between"
                >
                  {currentTag?.label || 'Filter By Tag'}

                  <RiArrowDownSLine
                    className=" text-steel-700 dark:text-steel-200"
                    aria-hidden="true"
                    size={20}
                  />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu className="dark:bg-steel-700 w-[--button-width]">
                <>
                  {isEmpty(tagOptions) ? (
                    <div className="relative px-5 py-8 text-sm font-medium text-center cursor-default select-none dark:text-gray-100 ">
                      Nothing found.
                    </div>
                  ) : (
                    <>
                      {tagOptions.map((tag) => (
                        <Dropdown.Item
                          className="capitalize"
                          key={tag.value}
                          onClick={() =>
                            setQueryParams({ tag: tag?.value ?? '' })
                          }
                        >
                          <Box className="w-5 mr-1.5">
                            {currentTag?.value === tag.value && (
                              <RiCheckLine size={20} />
                            )}
                          </Box>
                          {tag.label}
                        </Dropdown.Item>
                      ))}
                    </>
                  )}
                </>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown placement="bottom-start" className="w-full">
              <Dropdown.Trigger className="w-full">
                <Button
                  as="span"
                  variant="outline"
                  className="w-full justify-between"
                >
                  Sort By: {currentSort?.label}
                  <RiArrowDownSLine
                    className=" text-steel-700 dark:text-steel-200"
                    aria-hidden="true"
                    size={20}
                  />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu className="dark:bg-steel-700 w-[--button-width]">
                {FILE_SORT_OPTIONS.map((sort) => (
                  <Dropdown.Item
                    key={sort.value}
                    onClick={() => {
                      setQueryParams({ sort: sort.value });
                    }}
                  >
                    <Box className="w-5 mr-1.5">
                      {currentSort?.value === sort.value && (
                        <RiCheckLine size={20} />
                      )}
                    </Box>
                    {sort.label}
                  </Dropdown.Item>
                ))}
                <Separator />
                {ORDER_OPTIONS.map((order) => (
                  <Dropdown.Item
                    key={order.value}
                    onClick={() => {
                      setQueryParams({ order: order.value });
                    }}
                  >
                    <Box className="w-5 mr-1.5">
                      {currentOrder?.value === order.value && (
                        <RiCheckLine size={20} />
                      )}
                    </Box>
                    {order.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Flex>
        </Box>
      </Drawer>
    </Flex>
  );
};
