import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class DropdownTest extends React.Component {
    SearchbarDropdown = (props) => {
        const { options, onInputChange } = props;
        const ulRef = useRef();
        const inputRef = useRef();
        useEffect(() => {
            inputRef.current.addEventListener('click', (event) => {
                event.stopPropagation();
                ulRef.current.style.display = 'flex';
                onInputChange(event);
            });
            document.addEventListener('click', (event) => {
                ulRef.current.style.display = 'none';
            });
        }, []);
    }

    render() {
        return (
            <div className="search-bar-dropdown">
                <input
                    id="search-bar"
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    ref={inputRef}
                    onChange={onInputChange}
                />
                <ul id="results" className="list-group" ref={ulRef}>
                    {options.map((option, index) => {
                        return (
                            <button
                                type="button"
                                key={index}
                                onClick={(e) => {
                                    inputRef.current.value = option;
                                }}
                                className="list-group-item list-group-item-action"
                            >
                                {option}
                            </button>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
}

defaultOptions = [];
for (i = 0; i < 10; i++) {
    defaultOptions.push(`option ${i}`);
    defaultOptions.push(`suggesstion ${i}`);
    defaultOptions.push(`advice ${i}`);
}

    
}

export default DropdownTest;