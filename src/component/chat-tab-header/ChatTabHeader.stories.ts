import { Meta, StoryObj } from '@storybook/react';
import ChatTabHeader from './ChatTabHeader';

const meta: Meta<typeof ChatTabHeader> = {
  title: 'Component/ChatTabHeader',
  component: ChatTabHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    headerName: 'Group conversations',
    isBetween: true,
  },
};

export const BtnClass: Story = {
  args: {
    headerName: 'Group conversations',
    isBetween: true,
    btnClass:
      'bg-gradient-to-r from-pink-500 to-orange-500 text-white p-[2px] rounded-full',
  },
};
