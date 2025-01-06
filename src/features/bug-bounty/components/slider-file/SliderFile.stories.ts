// Slider.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import SliderFile from './SliderFile.tsx';

const meta: Meta<typeof SliderFile> = {
  title: 'Component/Slider',
  component: SliderFile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultSliderFile: Story = {};
