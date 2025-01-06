import type { Meta, StoryObj } from '@storybook/react';
// import { fn } from '@storybook/test';
import TabButton from './TabButton';
import { Button } from 'flowbite-react';
import { HiChatAlt, HiChatAlt2, HiUser } from 'react-icons/hi';
// import { useState } from 'react';
// import classNames from 'classnames';

const meta: Meta<typeof TabButton> = {
  title: 'Component/TabButton',
  component: TabButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // render: function Render(args) {
  //   const [selected, setSelected] = useState(args.selected);
  //   return (
  //     <>
  //       <TabButton></TabButton>
  //     </>
  //   );
  // },
};

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const VerticalTabButton: Story = {
  args: {
    displayType: 'vertical',
    children: (
      <>
        <Button>
          <HiChatAlt className="mr-2 h-5 w-5" />
          Direct
        </Button>
        <Button outline className="mt-2">
          <HiChatAlt2 className="mr-2 h-5 w-5" />
          Group
        </Button>
        <Button outline className="mt-2">
          <HiUser className="mr-2 h-5 w-5" />
          Friends
        </Button>
      </>
    ),
  },
};

export const HorizontalTabButton: Story = {
  args: {
    // selected: 1,
    displayType: 'horizontal',
    children: (
      <>
        <Button>
          <HiChatAlt className="mr-2 h-5 w-5" />
          Direct
        </Button>
        <Button outline>
          <HiChatAlt2 className="mr-2 h-5 w-5" />
          Group
        </Button>
        <Button outline>
          <HiUser className="mr-2 h-5 w-5" />
          Friends
        </Button>
      </>
    ),
  },
};

export const OnlyIconHorizontalTabButton: Story = {
  args: {
    displayType: 'horizontal',
    children: (
      <>
        <Button>
          <HiChatAlt className="h-5 w-5" />
        </Button>
        <Button outline>
          <HiChatAlt2 className="h-5 w-5" />
        </Button>
      </>
    ),
  },
};
