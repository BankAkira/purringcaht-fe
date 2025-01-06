import type { Meta, StoryObj } from '@storybook/react';
import Logo from './Logo';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Logo> = {
  title: 'Component/Logo',
  component: Logo,
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
export const _Logo: Story = {
  args: {
    alt: 'logo',
    src: 'https://t3884234.p.clickup-attachments.com/t3884234/7f56f686-1e68-49d6-aede-19e21ffe5348/Screenshot%202567-03-13%20at%2016.32.57.png',
  },
};
