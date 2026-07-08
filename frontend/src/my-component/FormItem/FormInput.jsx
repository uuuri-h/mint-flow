import React from 'react'

function FormInput({
    value,
    onChange,
    width = "100px",
    hasError = false,
    type = "text",
    ...props
}) {
    return (
        <input
            type={type}
            style={{ width }}
            value={value}
            className={`form-input ${hasError ? "input-error" : ""}`}
            onChange={onChange}
            {...props}
        />
    );
}

export default FormInput