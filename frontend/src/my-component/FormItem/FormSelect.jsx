import React from 'react'

// フォームのセレクトボックス
function FormSelect({
    selectedValue,
    options,
    hasError = false,
    onChange,
    ...props
}) {

    return (
        <div className='form-item'>
            <select
                value={selectedValue}
                className={`form-input ${hasError ? "input-error" : ""}`}

                onChange={onChange}
                {...props}
            >
            
            <option value="">
                {/* 選択してください */}
            </option>
            
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}

            </select>
        </div>
    )
}

export default FormSelect