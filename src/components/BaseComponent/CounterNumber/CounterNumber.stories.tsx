import { Meta, StoryObj } from '@storybook/react'
import CounterNumber, { ExposeRef } from './CounterNumber'
import { useRef } from 'react'

const meta = {
  title: 'BaseComponent/CounterNumber',
  component: CounterNumber,
} satisfies Meta<typeof CounterNumber>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    num: 3000,
    // numberClass: '',
    time: 1000,
  },
  render: (args) => {
    const counterRef = useRef<ExposeRef>(null)
    const handleReset = () => {
      if (counterRef.current) {
        counterRef.current.resetCounter()
      }
    }
    return (
      <div>
        <h3>Counter Example</h3>
        <CounterNumber ref={counterRef} {...args} />
        <div className="mt-2">
          <button
            onClick={handleReset}
            className="mt-0 px-1 py-1 bg-blue-500 text-white rounded"
          >
            Reset
          </button>
        </div>
      </div>
    )
  },
}
