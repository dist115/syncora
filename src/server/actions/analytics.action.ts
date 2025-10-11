'use server';

import { AnalyticsService } from '../service';
import { revalidateTag } from 'next/cache';


export const getAnalyticsData= async (teamId?: string,userId?:string)=>{
  const analyticsData= await AnalyticsService.getAnalyticsData(userId,teamId,)
  revalidateTag('get-analytics-data');
  return analyticsData;
}
export const getAllFileType = async () => {
  const fileTypes= await AnalyticsService.getAllFileType();
  revalidateTag('get-all-file-type');
  return fileTypes;
  
};

export const getUsageReportByMonth = async (teamId?: string,userId?:string) => {
  const monthlyUsage=await AnalyticsService.getUsageReportByMonth(teamId, userId)
  revalidateTag('get-usage-by-month');
  return monthlyUsage;
};

export const getUsageReportByType = async (teamId?: string,userId?:string) => {
  const usageByType=await AnalyticsService.getUsageReportByType(teamId, userId)
  revalidateTag('get-usage-by-type');
  return usageByType;
};

export const getTotalStorageUsed = async (teamId?: string,userId?:string) => {
  let totalSize = await AnalyticsService.getTotalStorageUsed(teamId, userId);
  revalidateTag('get-total-used-storage');
  return totalSize;

};