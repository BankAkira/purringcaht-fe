import { fn } from '@storybook/test';
// Icon.stories.tsx
import { FaSearch, FaWallet } from 'react-icons/fa';
import { Meta, StoryObj } from '@storybook/react';
import IconButton from './IconButton';
const meta: Meta<typeof IconButton> = {
  title: 'Component/IconButton',
  component: IconButton,
  argTypes: {
    color: { control: 'color' },
    onClick: { action: 'clicked' },
  },
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn(), width: 36, height: 36 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {
  args: {
    icon: FaSearch,
    color: '#6B7280',
    isActive: false,
  },
};

export const Wallet: Story = {
  args: {
    icon: FaWallet,
    color: '#FE0000',
    isActive: true,
  },
};

// export const Notification: Story = {
//   args: {
//     icon: 'notification',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };

// export const User: Story = {
//   args: {
//     icon: 'user',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };

// export const Menu: Story = {
//   args: {
//     icon: 'menu',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };

// export const Add: Story = {
//   args: {
//     icon: 'add',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Home: Story = {
//   args: {
//     icon: 'home',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const AddCicle: Story = {
//   args: {
//     icon: 'addCircle',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const ChartPie: Story = {
//   args: {
//     icon: 'chartPie',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Inbox: Story = {
//   args: {
//     icon: 'inbox',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Lock: Story = {
//   args: {
//     icon: 'lock',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const App: Story = {
//   args: {
//     icon: 'app',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Copy: Story = {
//   args: {
//     icon: 'copy',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const DotVertical: Story = {
//   args: {
//     icon: 'dotVertical',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };

// export const DotHorizontal: Story = {
//   args: {
//     icon: 'dotHorizontal',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Download: Story = {
//   args: {
//     icon: 'download',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const RightArrow: Story = {
//   args: {
//     icon: 'rightArrow',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const DownArrow: Story = {
//   args: {
//     icon: 'downArrow',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Document: Story = {
//   args: {
//     icon: 'document',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Gallery: Story = {
//   args: {
//     icon: 'gallery',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Audio: Story = {
//   args: {
//     icon: 'audio',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const CloseSquare: Story = {
//   args: {
//     icon: 'closeSquare',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Dislike: Story = {
//   args: {
//     icon: 'dislike',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Trash: Story = {
//   args: {
//     icon: 'trash',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };

// export const Close: Story = {
//   args: {
//     icon: 'close',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Alert: Story = {
//   args: {
//     icon: 'alert',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const MessageQuestion: Story = {
//   args: {
//     icon: 'messageQuestion',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const NotificationCircle: Story = {
//   args: {
//     icon: 'notificationCircle',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Twitter: Story = {
//   args: {
//     icon: 'twitter',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Instagram: Story = {
//   args: {
//     icon: 'instagram',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Link: Story = {
//   args: {
//     icon: 'link',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Facebook: Story = {
//   args: {
//     icon: 'facebook',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const File: Story = {
//   args: {
//     icon: 'file',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Time: Story = {
//   args: {
//     icon: 'time',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Community: Story = {
//   args: {
//     icon: 'community',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };
// export const Heart: Story = {
//   args: {
//     icon: 'heart',
//     color: '#6B7280',
//     width: 36,
//     height: 36,
//     isActive: false,
//   },
// };

// ... add more icon stories as needed
