import React from 'react'
import './MyBtn.css'

function MyBtn({ text, onClick, className }) {
return (
    <button 
        className={`button ${className || ""}`}
        onClick={onClick}
    >
        {text}
    </button>

)
}

export default MyBtn