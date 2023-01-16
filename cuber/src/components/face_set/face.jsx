import React from 'react'
import "./face.css"
import {nanoid} from "nanoid"

// Single face component which will be used in "index.jsx" 
export default function Face(props) 
{
	let faceBox = props.side.map(color =>
		{
			return (
				<div key={nanoid()} className={`single__face ${color}__face`}></div>
			);
		})
	// Structure contains 9 colored square boxes to show one face
	return (
		<div className="face__container flex__center--row">
			{faceBox}
		</div>
	);
}