// MediaThumbnail.stories.tsx
import { fn } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/react';
import MediaThumbnail from './MediaThumbnail';

const meta: Meta<typeof MediaThumbnail> = {
  title: 'Component/MediaThumbnail',
  component: MediaThumbnail,
  argTypes: {
    onImageClick: { action: 'clicked' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onImageClick: fn() },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    images: [
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/17c1f29373539add2d89cf13ca702158.jpeg?alt=media&token=5984928c-1980-4072-b929-2bb459d70c33',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
    ],
    size: 'medium',
  },
};
export const Small: Story = {
  args: {
    images: [
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/17c1f29373539add2d89cf13ca702158.jpeg?alt=media&token=5984928c-1980-4072-b929-2bb459d70c33',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
    ],
    size: 'small',
  },
};
export const Large: Story = {
  args: {
    images: [
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/17c1f29373539add2d89cf13ca702158.jpeg?alt=media&token=5984928c-1980-4072-b929-2bb459d70c33',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
      'https://firebasestorage.googleapis.com/v0/b/linx-goodgeek.appspot.com/o/70ed45d23fe5e80e672139c325ca54a9.jpeg?alt=media&token=ddf7deec-ae97-4b4e-a0f5-e3eb5129170b',
    ],
    size: 'large',
  },
};
// ... Add more stories for different variations or configurations if needed
