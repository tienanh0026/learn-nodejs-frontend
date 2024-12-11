import Select from '@components/BaseComponent/Select'
import BaseModal, { BaseModalProps } from '@components/Parts/BaseModal'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useId, useMemo, useState } from 'react'
import { HOUR_OPTION, MINUTE_OPTION } from './constants'
import { addLeadingZero } from '@modules/funcs/utils'

function ScheduleMessageModal({
  onSubmitScheduleMessage,
  loading,
  ...modalProps
}: Omit<BaseModalProps, 'children'> & {
  onSubmitScheduleMessage: (value: Date) => void
  loading?: boolean
}) {
  const currentTime = useMemo(() => new Date(), [])
  const [hour, setHour] = useState(currentTime.getHours())
  const [minute, setMintute] = useState(currentTime.getMinutes())
  const [date, setDate] = useState(currentTime.toISOString().split('T')[0])
  const id = useId()

  const scheduleTime = useMemo(() => {
    const time = new Date(date)
    time.setHours(hour)
    time.setMinutes(minute)
    return time
  }, [date, hour, minute])

  const handleSubmitScheduleMessage = () => {
    onSubmitScheduleMessage(scheduleTime)
  }

  const hourOptions = useMemo(() => {
    return HOUR_OPTION.filter((hourOption) => {
      if (new Date(date).getDate() === currentTime.getDate()) {
        return hourOption >= currentTime.getHours()
      }
      return true
    })
  }, [currentTime, date])

  const minOptions = useMemo(() => {
    return MINUTE_OPTION.filter((minOption) => {
      if (
        new Date(date).getDate() === currentTime.getDate() &&
        hour === currentTime.getHours()
      ) {
        return minOption >= currentTime.getMinutes()
      }
      return true
    })
  }, [currentTime, date, hour])

  return (
    <BaseModal
      {...modalProps}
      bodyClass="max-w-80 w-full"
      bgClass="opacity-15 bg-black"
    >
      <p className="font-bold mb-3">Select time</p>
      <div className="mb-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={currentTime.toISOString().split('T')[0]}
          className="mx-auto block border border-gray-600 px-3 py-1 rounded-md cursor-pointer"
        />
      </div>
      <div className="flex gap-2 justify-center mb-3">
        <Select
          selectValue={hour}
          onSelect={(value) => {
            setHour(value as number)
          }}
        >
          <Select.Trigger
            wrapperClass="border-none px-2 bg-gray-200 rounded-none"
            renderIcon={<ChevronDownIcon className="size-4" />}
          >
            {addLeadingZero(hour)}
          </Select.Trigger>
          <Select.Content
            align="center"
            wrapperClass="z-50 max-h-32 !overflow-auto"
          >
            {hourOptions.map((hour) => (
              <Select.Item
                value={hour}
                wrapperClass="px-3"
                key={id + 'hour' + hour}
              >
                {addLeadingZero(hour)}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <Select
          selectValue={hour}
          onSelect={(value) => {
            setMintute(value as number)
          }}
        >
          <Select.Trigger
            wrapperClass="border-none px-2 bg-gray-200 rounded-none"
            renderIcon={<ChevronDownIcon className="size-4" />}
          >
            {addLeadingZero(minute)}
          </Select.Trigger>
          <Select.Content
            align="center"
            wrapperClass="z-50 max-h-32 !overflow-auto"
          >
            {minOptions.map((min) => (
              <Select.Item
                value={min}
                wrapperClass="px-3"
                key={id + 'mintute' + min}
              >
                {addLeadingZero(min)}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      <div className="flex justify-between">
        <button
          className="border rounded-lg border-gray-400 text-gray-800 py-1 px-2"
          onClick={modalProps.onClose}
        >
          Cancel
        </button>
        <button
          className="border rounded-lg border-gray-400 text-gray-800 py-1 px-2"
          onClick={handleSubmitScheduleMessage}
          disabled={loading}
        >
          Confirm
        </button>
      </div>
    </BaseModal>
  )
}

export default ScheduleMessageModal
