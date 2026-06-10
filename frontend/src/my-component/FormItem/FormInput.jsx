import React from 'react'

function FormInput({
    value,
    onChange,
    width = "100px",
    type = "text",
    ...props
}) {
    return (
        <input
            className="form-input"
            type={type}
            style={{ width }}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
}

export default FormInput