import { MODULE, PermissionType } from './common';

const VIEW_FILES: PermissionType = {
  name: 'VIEW_FILES',
  module: MODULE.FILE,
  description: 'view files',
};

const EDIT_FILES: PermissionType = {
  name: 'EDIT_FILES',
  module: MODULE.FILE,
  description: 'edit files',
};

const DELETE_FILES: PermissionType = {
  name: 'DELETE_FILES',
  module: MODULE.FILE,
  description: 'delete files',
};

const UPLOAD_FILES: PermissionType = {
  name: 'UPLOAD_FILES',
  module: MODULE.FILE,
  description: 'upload files',
};

const DOWNLOAD_FILES: PermissionType = {
  name: 'DOWNLOAD_FILES',
  module: MODULE.FILE,
  description: 'download files',
};

const SHARE_FILES: PermissionType = {
  name: 'SHARE_FILES',
  module: MODULE.FILE,
  description: 'share files',
};

const CREATE_FOLDER: PermissionType = {
  name: 'CREATE_FOLDER',
  module: MODULE.FILE,
  description: 'create folder',
};



export const FILE_PERMISSIONS = {
  VIEW_FILES,
  EDIT_FILES,
  DELETE_FILES,
  UPLOAD_FILES,
  DOWNLOAD_FILES,
  SHARE_FILES,
  CREATE_FOLDER,
};
