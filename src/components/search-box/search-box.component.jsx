import React from 'react'

import './search-box.styles.css'

export const SearchBox = ({ placeholder, handleChange, ...props }) => (
    <input
        {...props}
        className='search input-field'
        type='search'
        placeholder={placeholder}
        onChange={handleChange} />
);