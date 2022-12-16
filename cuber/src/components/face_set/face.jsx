import React from 'react'
import "./face.css"
import {nanoid} from "nanoid"

export default function Face(props) 
{
	let faceBox = props.side.map(color =>
		{
			return (
				<div key={nanoid()} className={`single__face ${color}__face`}></div>
			);
		})
	return (
		<div className="face__container flex__center--row">
			{faceBox}
		</div>
	);
}