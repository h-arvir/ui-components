import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { InputField, type InputFieldProps } from './InputField';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  args: {
    label: 'Label',
    placeholder: 'Enter text...',
    helperText: 'Helper text goes here',
    variant: 'outlined',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<typeof InputField>;

export const Controlled: Story = {
  render: (args: InputFieldProps) => {
    const [val, setVal] = useState('');
    return (
      <div className="p-6 space-y-4 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        <InputField {...args} value={val} onChange={(e) => setVal(e.target.value)} clearable />
        <div>Value: {val || '—'}</div>
      </div>
    );
  },
};

export const Variants: Story = {
  render: (args: InputFieldProps) => {
    return (
      <div className="p-6 grid gap-6 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        <InputField {...args} label="Outlined" variant="outlined" placeholder="Outlined" />
        <InputField {...args} label="Filled" variant="filled" placeholder="Filled" />
        <InputField {...args} label="Ghost" variant="ghost" placeholder="Ghost" />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args: InputFieldProps) => {
    return (
      <div className="p-6 grid gap-6 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        <InputField {...args} label="Small" size="sm" placeholder="Small" />
        <InputField {...args} label="Medium" size="md" placeholder="Medium" />
        <InputField {...args} label="Large" size="lg" placeholder="Large" />
      </div>
    );
  },
};

export const States: Story = {
  render: (args: InputFieldProps) => (
    <div className="p-6 grid gap-6 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
      <InputField {...args} label="Default" placeholder="Type here" />
      <InputField {...args} label="Invalid" invalid errorMessage="This field is required" />
      <InputField {...args} label="Disabled" disabled placeholder="Disabled" />
      <InputField {...args} label="Loading" loading placeholder="Loading..." />
    </div>
  ),
};

export const Password: Story = {
  render: (args: InputFieldProps) => (
    <div className="p-6 grid gap-6 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
      <InputField {...args} label="Password" type="password" passwordToggle placeholder="Enter password" />
    </div>
  ),
};