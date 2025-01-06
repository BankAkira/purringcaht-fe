import type { Meta, StoryObj } from '@storybook/react';
import TextInput from './TextInput';
import { HiOutlineSearch } from 'react-icons/hi';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof TextInput> = {
  title: 'Component/TextInput',
  component: TextInput,
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
export const ConnectWalletTextInput: Story = {
  args: {
    placeholder: 'Search',
    icon: HiOutlineSearch,
  },
};
