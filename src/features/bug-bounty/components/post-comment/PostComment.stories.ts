// PostComment.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import PostComment from './PostComment.tsx';

const meta: Meta<typeof PostComment> = {
  title: 'Component/PostComment',
  component: PostComment,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultPostComment: Story = {};
