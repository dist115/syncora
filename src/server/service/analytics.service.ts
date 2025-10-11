import 'server-only';

import { db } from '@/db';
import {
  File,
  files as filesModel,
  team as teamModel,
  users,
} from '@/db/schema';

import {
  sql,
  count as sqlCount,
} from 'drizzle-orm';

import { FileTypeStats, FileUsageReport } from '../dto/files.dto';
import { KB, GB, MB } from '@/config/file';
import { formatTeamStorageCapacity, formatUserStorageCapacity } from '../actions/billing.action';
import { getAllFolders } from '../actions/folders.action';
import { getFiles } from '../actions/files.action';
import { formatFoldersData } from '@/lib/utils/file';

export const AnalyticsService = {
  getAnalyticsData: async(userId?: string,teamId?: string)=>{
    const totalStorage = teamId
    ? ((await formatTeamStorageCapacity()) as number)
    : ((await formatUserStorageCapacity()) as number);
    const folders = await getAllFolders(userId as string,teamId as string);
    const { files: allFiles } = await getFiles({},{allFiles:true});
    const allFolders=formatFoldersData(folders, allFiles)

    return {
      fileTypeStats: await AnalyticsService.getUsageReportByType(teamId, userId),
      usageReportByMonth: await AnalyticsService.getUsageReportByMonth(teamId, userId),
      totalUsed: await AnalyticsService.getTotalStorageUsed(teamId, userId),
      fileTypes:await AnalyticsService.getAllFileType(),
      totalStorage:totalStorage,
      allFolders:allFolders,
      allFiles:allFiles

    }
  },

  getAllFileType: async () => {
    const allFileType = await db
      .selectDistinct({ type: filesModel.type })
      .from(filesModel)
      .orderBy(filesModel.type);
    return allFileType;
  },

  getUsageReportByMonth: async (teamId?: string, userId?: string) => {
    const report = await db.execute(sql.raw(`WITH months AS (SELECT generate_series(1,12) AS month),
    file_sizes AS (SELECT EXTRACT(MONTH FROM f.created_at) AS month,
    SUM(CASE WHEN f.type = 'image' THEN f.file_size ELSE 0 END) AS image,
    SUM(CASE WHEN f.type = 'video' THEN f.file_size ELSE 0 END) AS video,
    SUM(CASE WHEN f.type = 'audio' THEN f.file_size ELSE 0 END) AS music,
    SUM(CASE WHEN f.type NOT IN('audio','video','image','folder') THEN f.file_size ELSE 0 END) AS document
    FROM files f
    ${teamId ? `WHERE f.team_id = '${teamId}'` : `WHERE f.user_id = '${userId}' AND f.team_id IS NULL`}
    GROUP BY EXTRACT(MONTH FROM f.created_at)),
    month_names AS (SELECT month,TO_CHAR(TO_DATE(month::text,'MM'),'Mon') AS month_name FROM months)
    SELECT
      mn.month_name AS "month",
      COALESCE(fs.image, 0) AS image,
      COALESCE(fs.video, 0) AS video,
      COALESCE(fs.document, 0) AS document,
      COALESCE(fs.music, 0) AS music
    FROM month_names mn
    LEFT JOIN file_sizes fs ON mn.month = fs.month
    ORDER BY mn.month;`)
    );

    return report.rows as unknown as FileUsageReport[];
  },

  getUsageReportByType: async (teamId?: string, userId?: string) => {
    const report = await db.execute(
      sql.raw(`SELECT 'image' AS TYPE,
      COUNT(*) FILTER (WHERE f.type = 'image') AS count,
      SUM(file_size) FILTER (WHERE f.type = 'image') AS size
      FROM files f
      ${teamId ? `WHERE f.team_id = '${teamId}'` : `WHERE f.user_id = '${userId}' AND f.team_id IS NULL`}
      UNION ALL
      SELECT 'video' AS TYPE,
      COUNT(*) FILTER (WHERE f.type = 'video') AS count,
      SUM(file_size) FILTER (WHERE f.type = 'video') AS size
      FROM files f
      ${teamId ? `WHERE f.team_id = '${teamId}'` : `WHERE f.user_id = '${userId}' AND f.team_id IS NULL`}
      UNION ALL
      SELECT 'audio' AS TYPE,
      COUNT(*) FILTER (WHERE f.type = 'audio') AS count,
      SUM(file_size) FILTER (WHERE f.type = 'audio') AS size
      FROM files f
      ${teamId ? `WHERE f.team_id = '${teamId}'` : `WHERE f.user_id = '${userId}' AND f.team_id IS NULL`}
      UNION ALL
      SELECT 'document' AS TYPE,
      COUNT(*) FILTER (WHERE f.type NOT IN('audio', 'video', 'image','folder')) AS count,
      SUM(file_size) FILTER (WHERE f.type NOT IN('audio', 'video', 'image','folder')) AS size
      FROM files f
      ${teamId ? `WHERE f.team_id = '${teamId}'` : `WHERE f.user_id = '${userId}' AND f.team_id IS NULL`}`)
    );

    return report.rows as unknown as FileTypeStats;
  },

  getTotalStorageUsed: async (teamId?: string, userId?: string) => {
    const query = teamId ? sql.raw(`SELECT 
    SUM(file_size) FILTER (WHERE f.type NOT IN ('folder')) AS total_used
    FROM files f
    WHERE f.team_id = '${teamId}'`) : sql.raw(`
    SELECT SUM(file_size) FILTER (WHERE f.type NOT IN ('folder')) AS total_used
    FROM files f
    WHERE f.user_id = '${userId}' AND f.team_id IS NULL`);

    const report = await db.execute(query);
    const totalUsed = report.rows.length > 0 ? Number(report.rows[0].total_used) : 0;

     return {
      bytes: totalUsed,
      kb: (totalUsed / KB).toFixed(2),
      mb: (totalUsed / MB).toFixed(2),
      gb: (totalUsed / GB).toFixed(2),
    };
  },

};
