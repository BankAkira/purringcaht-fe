// Import necessary modules and types
import axios from '../helper/axios';
import environment from '../environment';
import { PageInfo } from '../type/common';
import {
  BugBountyPayload,
  CreatePostBugForm,
  ConfirmReportBug,
  ConfirmReportBugPayload,
} from '../type/bug-bounty';

// Create a new bug report
export async function createPostBugBountyApi(
  body: CreatePostBugForm
): Promise<BugBountyPayload | undefined> {
  const url = `${environment.apiUrl}/report-bugs`;
  const { data } = await axios.post(url, body);
  return data;
}

// Get a list of bug reports with optional sorting and pagination
export async function getPostBugBountyApi(
  params?: string
): Promise<PageInfo<BugBountyPayload[]> | undefined> {
  const url = `${environment.apiUrl}/report-bugs/${params}`;
  const { data } = await axios.get(url);
  return data;
}

// Get a specific bug report by ID
export async function getBugBountyByIdApi(
  bugBountyId: string
): Promise<BugBountyPayload | undefined> {
  const url = `${environment.apiUrl}/report-bugs/${bugBountyId}`;
  const { data } = await axios.get(url);
  return data;
}

// Create a confirmation report bug entry
export async function createConfirmReportBugApi(
  body: ConfirmReportBugPayload
): Promise<ConfirmReportBug | undefined> {
  const url = `${environment.apiUrl}/confirm-report-bugs`;
  const { data } = await axios.post(url, body);
  return data;
}

// Get a list of confirm report bug with optional sorting and pagination
export async function getConfirmReportBugApi(
  params?: string
): Promise<PageInfo<ConfirmReportBug[]> | undefined> {
  const url = `${environment.apiUrl}/confirm-report-bugs/${params}`;
  const { data } = await axios.get(url);
  return data;
}

// Get a specific confirm report bug by ID
export async function getConfirmReportBugByIdApi(
  confirmBugBountyId: string
): Promise<ConfirmReportBug | undefined> {
  const url = `${environment.apiUrl}/confirm-report-bugs/${confirmBugBountyId}`;
  const { data } = await axios.get(url);
  return data;
}
