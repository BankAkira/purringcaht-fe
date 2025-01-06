import type { Meta, StoryObj } from '@storybook/react';
import Landing from './Landing';
import Button from '../button/Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Landing> = {
  title: 'Component/Landing',
  component: Landing,
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
export const ConnectWalletLanding: Story = {
  args: {
    title: 'Connect Wallet to Continue',
    subTitle: 'Please connect your wallet to chat with the others.',
    src: 'https://t3884234.p.clickup-attachments.com/t3884234/7f56f686-1e68-49d6-aede-19e21ffe5348/Screenshot%202567-03-13%20at%2016.32.57.png',
    button: (
      <Button
        size="lg"
        label="Connect wallet"
        variant="primary"
        className="text-white bg-gradient-to-br mt-2 from-pink-500 to-orange-400"
        onClick={() => alert('Call Provider!')}
      />
    ),
  },
};

const mockAcceptChatRequestLandingAddress =
  '0xD51EF194E19cE5b35C20aD7B2aE15652C23c694B';

export const AcceptChatRequestLanding: Story = {
  args: {
    title: 'You have a business purpose chat request',
    subTitle:
      '"I want to discuss about the data pack you are selling on the platfform please accept the chat request."',
    hint: `Accept the chat request from ${mockAcceptChatRequestLandingAddress} before start a conversation`,
    button: (
      <Button
        size="lg"
        label="Accept chat request"
        variant="primary"
        className="text-white bg-gradient-to-br mt-2 from-pink-500 to-orange-400"
        onClick={() => alert('Accept chat request process...')}
      />
    ),
  },
};

export const NoChatSelectedLanding: Story = {
  args: {
    title: 'No chat selected',
    subTitle:
      'Datepicker the chat room from lect navigation bar to start a conversation.',
    src: 'https://t3884234.p.clickup-attachments.com/t3884234/7f56f686-1e68-49d6-aede-19e21ffe5348/Screenshot%202567-03-13%20at%2016.32.57.png',
  },
};

export const FetchingDataLanding: Story = {
  args: {
    title: 'Fetching data',
    subTitle: 'Please wait we are fetching data from server and blockchain.',
    src: 'https://t3884234.p.clickup-attachments.com/t3884234/7f56f686-1e68-49d6-aede-19e21ffe5348/Screenshot%202567-03-13%20at%2016.32.57.png',
  },
};
