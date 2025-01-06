import { PageInfo } from './common';

export type Platform = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
};

export type GetPlatform = PageInfo<Platform[]>;
