import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Avatar from './Avatar';
import { defaultImages } from '../../constant/default-images';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Avatar> = {
  title: 'Component/Avatar',
  component: Avatar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  args: {
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const ChatFeedHeader: Story = {
  args: {
    img: defaultImages.noProfile,
    name: 'Micheal Gough',
    status: 'online',
    isShowTextStatus: true,
  },
};

export const ContactTab: Story = {
  args: {
    img: defaultImages.noProfile,
    name: 'Micheal Gough',
  },
};

export const ChatTab: Story = {
  args: {
    img: defaultImages.noProfile,
    name: 'Micheal Gough',
    text: 'Nvm, I will grab all in maxi..',
  },
};

export const ChatProfile: Story = {
  args: {
    img: defaultImages.noProfile,
    name: 'Micheal Gough',
    text: '0x134D...6801',
    size: 'lg',
    isChatProfile: true,
  },
};

export const MultiImages: Story = {
  args: {
    img: [
      defaultImages.noProfile,
      defaultImages.noProfile,
      defaultImages.noProfile,
      defaultImages.noProfile,
    ],
    size: 'sm',
    name: 'Group',
    text: 'John: Beautiful day!',
  },
};
