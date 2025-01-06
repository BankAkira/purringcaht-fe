import { fn } from '@storybook/test';
import { defaultImages } from '../../constant/default-images';
import ChatTab from './ChatTab';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ChatTab> = {
  title: 'Component/CardTab',
  component: ChatTab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    img: defaultImages.noProfile,
    name: 'Micheal Gough',
    text: 'Nvm, I will grab all in maxico and go to USA',
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ReadedChat: Story = {
  args: {
    status: 'online',

    timestamp: 1710429311,
  },
};

export const UnreadedChat: Story = {
  args: {
    status: 'online',

    timestamp: 1710429311,
  },
};

export const GroupChat: Story = {
  args: {
    img: [defaultImages.noProfile, defaultImages.noProfile],
    name: 'JAV (Japan Action Video)',

    timestamp: 1710429311,
  },
};
