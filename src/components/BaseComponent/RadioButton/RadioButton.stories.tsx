import { Meta, StoryObj } from '@storybook/react'
import { RadioButton } from './RadioButton'

const meta = {
  title: 'BaseComponent/RadioButton',
  component: RadioButton,
} satisfies Meta<typeof RadioButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Radio Button',
    value: '1',
  },
}
