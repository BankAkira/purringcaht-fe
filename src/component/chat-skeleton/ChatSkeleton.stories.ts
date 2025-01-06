// ChatSkeleton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ChatSkeleton from './ChatSkeleton';

const meta: Meta<typeof ChatSkeleton> = {
  title: 'Component/ChatSkeleton',
  component: ChatSkeleton,
  tags: ['autodocs'],
  // Define argTypes for any props to control their behavior in Storybook
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['direct', 'group'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    count: {
      control: { type: 'number' },
    },
  },
};

export default meta;

// Default story with minimal configuration
export const Default: StoryObj<typeof ChatSkeleton> = {
  args: {
    type: 'direct',
    loading: true,
    count: 2,
  },
};

// Individual Loading State with different counts
export const IndividualSingle: StoryObj<typeof ChatSkeleton> = {
  args: {
    ...Default.args,
    count: 1,
  },
};

export const IndividualMultiple: StoryObj<typeof ChatSkeleton> = {
  args: {
    ...Default.args,
    count: 5,
  },
};

// Group Loading State with different counts
export const GroupSingle: StoryObj<typeof ChatSkeleton> = {
  args: {
    ...Default.args,
    type: 'group',
    count: 1,
  },
};

export const GroupMultiple: StoryObj<typeof ChatSkeleton> = {
  args: {
    ...Default.args,
    type: 'group',
    count: 3,
  },
};

// Loading false - to showcase the skeleton in a non-loading state (if applicable)
export const NotLoading: StoryObj<typeof ChatSkeleton> = {
  args: {
    ...Default.args,
    loading: false,
  },
};

// Add additional stories as needed to cover other specific states or variations
