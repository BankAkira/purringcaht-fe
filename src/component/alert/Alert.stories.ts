import { Meta, StoryObj } from '@storybook/react';
import Alert from '../alert/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Component/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: {
      label: 'This conversation is on a dispute',
    },
    description: {
      label:
        'This conversation is on a dispute and waiting for community to vote this dispute, however the result of community voted will be shown up here.',
    },
  },
};
