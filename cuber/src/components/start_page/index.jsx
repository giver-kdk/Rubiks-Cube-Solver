import React from 'react'
import cube_start from "./cube_start.png"
import "./style.css"
import CubeRotate from './cube';

// Structure of 1st Page
export default function Start(props)
{
	return (
		<div className="start__container flex__center--col">
			<div className="start__heading">solve rubik's cube.</div>
			<div className="cube__img--container">
				{/* <img src={cube_start} alt="Isometric Rubiks Cube" className="cube__intro--pic" /> */}
				<CubeRotate/>
			</div>
			<button className="start__btn" onClick={props.handleClick}>Start</button>
		</div>
	);
}