import React from 'react'

// フォームのセレクトボックス
function FormSelect({
    selectedValue,
    options,
    onChange
}) {

    return (
        <div className='form-item'>
            <select
                className="form-input"
                value={selectedValue}
                onChange={onChange}
            >
            
            <option value="">選択してください</option>
            
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