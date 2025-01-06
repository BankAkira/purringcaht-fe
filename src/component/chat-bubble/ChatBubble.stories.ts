// ChatBubble.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ChatBubble from './ChatBubble';

const meta: Meta<typeof ChatBubble> = {
  title: 'Component/ChatBubble',
  component: ChatBubble,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    fileDetails: {
      control: { type: 'object' },
    },
  },
  //   args: {
  //     onClick: fn(),
  //   },

  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const UserTextMessage: Story = {
  args: {
    message: "That's awesome. Thank you. Can we meet tonight?",
  },
};

export const ReceiverTextMessage: Story = {
  args: {
    message: "That's awesome. Thank you. Can we meet tonight?",
    isSender: true,
  },
};

export const OtherFileMessage: Story = {
  args: {
    message: 'Work Contract final • 12 Pages • 18 MB • PDF',
    fileDetails: {
      name: 'Work Contract final',
      page: '12 Pages',
      size: '18 MB',
      type: 'PDF',
    },
  },
};
export const SenderFileMessage: Story = {
  args: {
    message: 'Work Contract final • 12 Pages • 18 MB • PDF',
    fileDetails: {
      name: 'Work Contract final',
      page: '12 Pages',
      size: '18 MB',
      type: 'PDF',
    },
    isSender: true,
  },
};

// ...additional stories for other variations
