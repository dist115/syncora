export interface FileUsageReport {
  month: string;
  image: number;
  video: number;
  document: number;
  music: number;
}

export interface FileTypeStats {
  type: string;
  count: number;
  size: number;
}
