import type { Meta, StoryObj } from '@storybook/react';
import Chat from './Chat';
import { AvatarProps } from '../../type/chat';
import { defaultImages } from '../../constant/default-images';

const mockChatBubbleReceiver = {
  message:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe non minima tenetur quis, voluptatibus consectetur suscipit quisquam adipisci ut necessitatibus!',
  date: new Date(Date.now() - 15 * 60 * 1000),
};

const mockChatBubbleSender = {
  message:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe non minima tenetur quis, voluptatibus consectetur suscipit quisquam adipisci ut necessitatibus!',
  date: new Date(Date.now() - 15 * 60 * 1000),
};

const mockChatBubbleFile = {
  fileDetails: {
    name: 'Work Contract final',
    page: '12 Pages',
    size: '1mb',
    type: 'PDF',
  },
  date: new Date(Date.now() - 15 * 60 * 1000),
};

const mockAvatar: AvatarProps = {
  img: defaultImages.noProfile,
  name: 'Micheal Jordan',
  size: 'sm',
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Chat> = {
  title: 'Component/Chat',
  component: Chat,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
};

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ChatSender: Story = {
  args: {
    avatar: { ...mockAvatar, chatBubble: mockChatBubbleSender },
    isDelivered: true,
    isSender: true,
  },
};

export const ChatReceiver: Story = {
  args: {
    avatar: { ...mockAvatar, chatBubble: mockChatBubbleReceiver },
    isDelivered: false,
    isSender: false,
  },
};

export const ChatFileSender: Story = {
  args: {
    avatar: {
      ...mockAvatar,
      chatBubble: mockChatBubbleFile,
    },
    isDelivered: true,
    isSender: true,
  },
};

export const ChatFileReceiver: Story = {
  args: {
    avatar: {
      ...mockAvatar,
      chatBubble: mockChatBubbleFile,
    },
    isSender: false,
  },
};
