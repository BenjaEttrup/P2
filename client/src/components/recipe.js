import React from 'react';
import '../stylesheets/recipe.css'
import { useParams } from 'react-router-dom';
import RecipePage from './recipePage';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
function Recipe() {
    let { id } = useParams();
    function errorMessage() {
        return (
            <div>
                <h1>Page not found</h1>
            </div>
        )
    }

    // HTML
    return (
        <div>
            {id ? <RecipePage id={id} /> : errorMessage()}
        </div>
    );

}

export default Recipe;
