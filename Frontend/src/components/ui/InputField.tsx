import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 text-white"
        placeholder={placeholder}
        required
      />
    </div>
  </div>
);

export default InputField;
