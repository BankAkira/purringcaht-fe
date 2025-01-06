// FilesThumbnail.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import FilesThumbnail from './FilesThumbnail';

export default {
  title: 'Component/FilesThumbnail',
  component: FilesThumbnail,
  parameters: {
    // parameters for autodocs can be added here if needed
  },
  tags: ['autodocs'],
} as Meta;

export const PDF: StoryObj<typeof FilesThumbnail> = {
  args: {
    name: 'Work Contract final',
    size: '18 MB',
    extension: 'PDF',
    pages: 12,
    type: 'FILE',
  },
};

export const Image: StoryObj<typeof FilesThumbnail> = {
  args: {
    name: 'My cats.jpg',
    size: '8 MB',
    extension: 'jpg',
    type: 'IMAGE',
  },
};

export const Video: StoryObj<typeof FilesThumbnail> = {
  args: {
    name: 'music.mp4',
    size: '5.3 MB',
    extension: 'MP4',
    type: 'VIDEO',
  },
};

// You can continue adding more stories for other file types if needed.
