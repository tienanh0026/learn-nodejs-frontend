import { Meta, StoryObj } from '@storybook/react'
import { RadioButton, RadioGroup } from './RadioButton'
import { expect, userEvent, within } from '@storybook/test'

const meta = {
  title: 'BaseComponent/RadioButtonGroup',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '',
  },
  render: () => {
    const values = [
      { label: 'Radio Button 1', value: '1' },
      { label: 'Radio Button 2', value: '2' },
      { label: 'Radio Button 3', value: '3' },
      { label: 'Radio Button 4', value: '4' },
      { label: 'Radio Button 5', value: '5' },
      { label: 'Radio Button 6', value: '6' },
      { label: 'Radio Button 7', value: '7' },
    ]
    return (
      <RadioGroup>
        {values.map((value) => (
          <RadioButton
            key={value.value}
            label={value.label}
            value={value.value}
          />
        ))}
      </RadioGroup>
    )
  },
}

const values = [
  { label: 'Radio Button 1', value: '1' },
  { label: 'Radio Button 2', value: '2' },
  { label: 'Radio Button 3', value: '3' },
  { label: 'Radio Button 4', value: '4' },
  { label: 'Radio Button 5', value: '5' },
  { label: 'Radio Button 6', value: '6' },
  { label: 'Radio Button 7', value: '7' },
]

export const SelectButton: Story = {
  args: { children: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radioButton = await canvas.findByText(values[2].label)
    await expect(radioButton).toBeInTheDocument()
    console.log(radioButton)
    await userEvent.click(radioButton)
    // const selectedInput = canvas.getByRole('radio', { checked: true })
    const selectedInput = canvas.getByDisplayValue(values[2].value)
    await expect(selectedInput).toBeChecked()
  },
  render: () => {
    return (
      <RadioGroup>
        {values.map((value) => (
          <RadioButton label={value.label} value={value.value} />
        ))}
      </RadioGroup>
    )
  },
}
