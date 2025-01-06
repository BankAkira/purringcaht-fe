import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from './Button';
import { HiOutlineArrowRight, HiOutlineShoppingCart } from 'react-icons/hi';

const meta: Meta<typeof Button> = {
  title: 'Component/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    // className: 'text-white',
  },
};

export const Success: Story = {
  args: {
    label: 'Success Button',
    variant: 'success',
    className: 'text-white',
  },
};

export const GradientDanger: Story = {
  args: {
    label: 'Gradient Danger Button',
    variant: 'danger',
    enabledGradient: true,
    className: 'text-white',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small Button',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    disabled: true,
    className: 'text-gray-400',
  },
};

export const GradientOutline: Story = {
  args: {
    label: 'Gradient Outline Button',
    variant: 'warning',
    isOutline: true,
  },
};

export const Custom: Story = {
  args: {
    size: 'lg',
    label: 'Custom Button',
    variant: 'primary',
    className: 'text-white bg-gradient-to-br from-pink-500 to-orange-400',
  },
};

export const Icon: Story = {
  args: {
    iconLeftSide: <HiOutlineShoppingCart className="mr-2 h-5 w-5" />,
    label: 'Button Text',
    iconRightSide: <HiOutlineArrowRight className="ml-2 h-5 w-5" />,
    className: 'flex flex-wrap gap-2',
  },
};
