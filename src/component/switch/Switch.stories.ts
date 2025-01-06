// Switch.stories.tsx

import { Meta, StoryObj } from '@storybook/react';
import SwitchButton from './Switch';
// import { fn } from '@storybook/test';
const meta: Meta<typeof SwitchButton> = {
  title: 'Component/SwitchButton',
  component: SwitchButton,
  argTypes: {
    isActive: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    onToggle: { action: 'toggled' }, // This will log the toggle action
    label: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  //   args: { onToggle: fn() },
};

export default meta;

export const Default: StoryObj<typeof SwitchButton> = {
  args: {
    label: 'Mute notifications',
    isActive: false,
    isDisabled: false,
  },
};

export const Active: StoryObj<typeof SwitchButton> = {
  args: {
    label: 'Mute notifications',
    isActive: true,
    isDisabled: false,
  },
};

export const Disabled: StoryObj<typeof SwitchButton> = {
  args: {
    label: 'Mute notifications',
    isActive: false,
    isDisabled: true,
  },
};

export const ActiveDisabled: StoryObj<typeof SwitchButton> = {
  args: {
    label: 'Mute notifications',
    isActive: true,
    isDisabled: true,
  },
};
