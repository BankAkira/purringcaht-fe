import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';
import { Button } from 'flowbite-react';

const meta: Meta<typeof Modal> = {
  title: 'Component/Modal',
  component: Modal,
  tags: ['autodocs'],
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SimpleModal: Story = {
  args: {
    isOpen: false,
    children: <p>Modal Content</p>,
    header: 'Terms of Service',
    footer: (
      <>
        <Button>I accept</Button>
        <Button color="gray">Decline</Button>
      </>
    ),
  },
};

export const DismissibleModal: Story = {
  args: {
    isOpen: false,
    dismissible: true,
    children: <p>Modal Content</p>,
    header: 'Terms of Service',
    footer: (
      <>
        <Button>I accept</Button>
        <Button color="gray">Decline</Button>
      </>
    ),
  },
};

export const WithoutHeaderAndFooter: Story = {
  args: {
    isOpen: false,
    children: <p>Modal Content</p>,
  },
};
