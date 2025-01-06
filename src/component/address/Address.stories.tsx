import type { Meta, StoryObj } from '@storybook/react';
import Address from './Address';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Address> = {
  title: 'Component/Address',
  component: Address,
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
export const _Address: Story = {
  args: {
    text: '0xD51EF194E19cE5b35C20aD7B2aE15652C23c694B',
    onCopy: () => {
      alert('copied!');
    },
  },
};
