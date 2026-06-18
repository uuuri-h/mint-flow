import React from 'react'

// フォームのセレクトボックス
function FormSelect({
    selectedValue,
    options,
    onChange,
    ...props
}) {

    return (
        <div className='form-item'>
            <select
                className="form-input"
                value={selectedValue}
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