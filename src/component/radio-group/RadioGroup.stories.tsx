import type { Meta, StoryObj } from '@storybook/react';
import RadioGroup from './RadioGroup';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof RadioGroup> = {
  title: 'Component/RadioGroup',
  component: RadioGroup,
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
export const RadioGroupWithoutLegend: Story = {
  args: {
    name: 'request-to-chat-purpose-radio',
    radios: [
      {
        title: 'Business purpose',
        id: 'business-purpose-radio',
        value: 'business-purpose-radio',
        supTitle: 'Contact for business',
        defaultChecked: true,
      },
      {
        title: 'Making friend',
        id: 'making-friend-radio',
        value: 'making-friend-radio',
        supTitle: 'Want to be a friend with',
      },
      {
        title: 'Ask for help',
        id: 'ask-for-help-radio',
        value: 'ask-for-help-radio',
        supTitle: 'You need his/her help',
      },
      {
        title: 'Other',
        id: 'other-radio',
        value: 'other-radio',
        supTitle: 'the other purpose',
      },
    ],
  },
};

export const RadioGroupWithLegend: Story = {
  args: {
    legendText: 'hello legend',
    name: 'radio-test',
    radios: [
      {
        title: 'radio_a title',
        id: 'radio_a',
        value: 'radio_a',
        supTitle: 'radio_a subtitle',
      },
      {
        title: 'radio_b title',
        id: 'radio_b',
        value: 'radio_b',
        supTitle: 'radio_b subtitle',
        defaultChecked: true,
      },
      {
        title: 'radio_c title disabled',
        id: 'radio_c',
        value: 'radio_c',
        supTitle: 'radio_c subtitle disabled',
        disabled: true,
      },
    ],
  },
};
