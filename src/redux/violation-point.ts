// import (Internal imports)
import { StoreDispatch } from '.';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// type definitions
import { ViolationPointConfigName } from '../type/auth';

// helper functions
import { Logger } from '../helper/logger';
import { errorFormat } from '../helper/error-format';
import sleep from '../helper/sleep';

// constants
import { defaultViolationPoint } from '../constant/violation-point';

// components
import { ReportCategory, ReportOption } from '../component/@share/ReportModal';

// APIs
import {
  createViolationPointConfig,
  getViolationPointConfig,
} from '../rest-api/violation-point';

const log = new Logger('violation-point-redux');

export type ViolationPointReducerState = {
  violationPointConfig?: ReportOption[];
};

const initialState: ViolationPointReducerState = {
  violationPointConfig: undefined,
};

const violationPointSlice = createSlice({
  name: 'violationPoint',
  initialState,
  reducers: {
    initializeViolationPointConfig: (
      state,
      action: PayloadAction<{
        pointConfig: ReportOption[];
      }>
    ) => ({
      ...state,
      violationPointConfig: action.payload.pointConfig,
    }),
  },
});

const { initializeViolationPointConfig } = violationPointSlice.actions;

export const setDefaultViolationPointConfig =
  () => async (dispatch: StoreDispatch) => {
    try {
      let resp = await getViolationPointConfig();
      if (Array.isArray(resp) && !resp.length) {
        const promises = defaultViolationPoint.map(item =>
          createViolationPointConfig(item)
        );
        await Promise.all(promises);
        await sleep(500);
        resp = await getViolationPointConfig();
      }
      const options: ReportOption[] = resp.map(item => ({
        title: setNameViolationPointConfig(item.name).title,
        type: item.id,
        point: item.point,
        category: setNameViolationPointConfig(item.name).category,
      }));
      dispatch(initializeViolationPointConfig({ pointConfig: options }));
    } catch (error) {
      log.error(errorFormat(error).message);
    }
  };

const setNameViolationPointConfig = (
  name: ViolationPointConfigName
): { title: string; category: ReportCategory } => {
  switch (name) {
    case 'Discrimination':
      return {
        title: 'Discrimination',
        category: 'Disregard for Ethics and Privacy',
      };
    case 'Honesty and Truthfulness':
      return { title: 'Humbug', category: 'Unethical Actions' };
    case 'No Harmful Content':
      return {
        title: 'Harmful Content',
        category: 'Harmful Expressions/Content',
      };
    case 'No Hate Speech':
      return { title: 'Hate Speech', category: 'Harmful Expressions/Content' };
    case 'No Plagiarism':
      return { title: 'Plagiarism', category: 'Unethical Actions' };
    case 'No Pornography':
      return { title: 'Pornography', category: 'Harmful Expressions/Content' };
    case 'Others':
      return { title: 'Others', category: 'Others' };
    case 'Positive Engagement':
      return {
        title: 'Negative Engagement',
        category: 'Harmful Expressions/Content',
      };
    case 'Respect for Intellectual Property':
      return {
        title: 'Disregard for Intellectual Property',
        category: 'Disregard for Ethics and Privacy',
      };
    case 'Respect for Privacy':
      return {
        title: 'Invasion of Privacy',
        category: 'Disregard for Ethics and Privacy',
      };
    case 'Zero Tolerance for Fraud':
      return { title: 'Fraud', category: 'Unethical Actions' };
    default:
      return { title: '', category: 'Disregard for Ethics and Privacy' };
  }
};

export default violationPointSlice;
