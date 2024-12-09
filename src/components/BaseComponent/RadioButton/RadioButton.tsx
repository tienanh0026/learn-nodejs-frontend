import clsx from 'clsx'
import {
  createContext,
  InputHTMLAttributes,
  useContext,
  useRef,
  useState,
} from 'react'
import Ripple, { RippleRef } from '../Ripple'

type RadioValueType = string

type RadioGroupContext = {
  defaultValue?: RadioValueType
  value?: RadioValueType
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
}

type RadioGroupProps = RadioGroupContext & {
  children: React.ReactNode
  wrapperClass?: string
}

type RadioButtonProps = {
  label: string
  value: RadioValueType
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
  wrapperClass?: string
}

const RadioGroupContext = createContext<RadioGroupContext>({})

function RadioGroup({
  children,
  defaultValue,
  value: controlledValue,
  onChange,
  name,
  wrapperClass,
}: RadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<
    RadioValueType | undefined
  >(defaultValue)

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : uncontrolledValue
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledValue(e.target.value)
    }
    if (onChange) {
      onChange(e)
    }
  }
  return (
    <RadioGroupContext.Provider
      value={{
        defaultValue: defaultValue,
        onChange: handleChange,
        value: currentValue,
        name: name,
      }}
    >
      <div className={wrapperClass}>{children}</div>
    </RadioGroupContext.Provider>
  )
}

function RadioButton({
  label,
  inputProps,
  value,
  wrapperClass,
}: RadioButtonProps) {
  const radioContext = useContext(RadioGroupContext)
  const isChecked = radioContext.value
    ? radioContext.value === value
    : radioContext.defaultValue === value
  const rippleRef = useRef<RippleRef>(null)
  return (
    <>
      <label
        className={clsx(wrapperClass, 'flex gap-1 h-6 cursor-pointer relative')}
      >
        <input
          {...inputProps}
          name={radioContext.name}
          checked={isChecked}
          value={value}
          onChange={radioContext.onChange}
          type="radio"
          style={{ display: 'none' }}
        />

        <span
          data-check={isChecked}
          onMouseDown={(e) => {
            if (!rippleRef.current) return
            rippleRef.current.addRipple(e)
          }}
          className="m-1 data-[check=true]:bg-blue-600 rounded-full border border-black data-[check=true]:border-blue-600 transition-all relative"
        >
          <Ripple ref={rippleRef} />
          <span className="rounded-full h-full block aspect-square border-2 border-white"></span>
        </span>
        <span>{label}</span>
      </label>
    </>
  )
}

export { RadioGroup, RadioButton }
