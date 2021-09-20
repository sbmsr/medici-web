export default function InputField({
  name,
  optional = false,
  placeholder,
}: {
  name: string
  optional: boolean
  placeholder: string
}): JSX.Element {
  return (
    <div className="py-5 max-w-md">
      <div className="flex justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {name}
        </label>
        {optional && (
          <span className="text-sm text-gray-500" id="email-optional">
            Optional
          </span>
        )}
      </div>
      <div className="mt-1">
        <input
          type="text"
          name={name}
          id={name}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          aria-describedby={`${name}${optional && '-optional'}`}
        />
      </div>
    </div>
  )
}
