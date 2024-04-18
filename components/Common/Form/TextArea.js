import React from 'react'

export default function TextArea({
    text,
    required,
    placeholder,
    type,
    value,
    onChange,
    min,
    max,
    disabled,
}) {
  return (
    <div className="w-full font-poppins mt-6">
    <label className=" text-primary-black">
      {text}
      {required && <span className="text-red-500">&nbsp;*</span>}
    </label>
    <textarea
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      onChange={onChange}
      min={min}
      max={max}
      required={required}
      disabled={disabled}
      className={`
              w-full h-32  border  border-primary-black border-opacity-[0.15] rounded-md mt-2 px-3 py-2 
              focus:border-[#FEC703] focus:outline-none bg-white dateSelectorColor 
              ${disabled && "bg-gray-200 cursor-not-allowed"}
      `}
    />
  </div>
  )
}
