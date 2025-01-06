// Slider.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ProfileSkeleton from './ProfileSkeleton.tsx';

const meta: Meta<typeof ProfileSkeleton> = {
  title: 'Component/Slider',
  component: ProfileSkeleton,
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
export const Default: StoryObj<typeof ProfileSkeleton> = {
  args: {
    type: 'direct',
    loading: true,
    count: 2,
  },
};

// Individual Loading State with different counts
export const IndividualSingle: StoryObj<typeof ProfileSkeleton> = {
  args: {
    ...Default.args,
    count: 1,
  },
};

export const IndividualMultiple: StoryObj<typeof ProfileSkeleton> = {
  args: {
    ...Default.args,
    count: 5,
  },
};

// Group Loading State with different counts
export const GroupSingle: StoryObj<typeof ProfileSkeleton> = {
  args: {
    ...Default.args,
    type: 'group',
    count: 1,
  },
};

export const GroupMultiple: StoryObj<typeof ProfileSkeleton> = {
  args: {
    ...Default.args,
    type: 'group',
    count: 3,
  },
};

// Loading false - to showcase the skeleton in a non-loading state (if applicable)
export const NotLoading: StoryObj<typeof ProfileSkeleton> = {
  args: {
    ...Default.args,
    loading: false,
  },
};

// Add additional stories as needed to cover other specific states or variations
