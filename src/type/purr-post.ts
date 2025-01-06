export type Sticker = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stickerCategoryId: string;
};

export type MessageOptional = {
  fileSize?: number;
  fileName?: string;
  fileType?: string;
  lastModified?: number;
  pageCount?: number | null;
  stickerInfo?: Sticker;
};

export type SelectedFile = {
  file: File;
  optional: MessageOptional;
};

export const TabPosts = [
  {
    display: 'FOR_YOU',
    value: 'For you',
  },
  {
    display: 'FOLLOWING',
    value: 'Following',
  },
];
