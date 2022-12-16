import React from 'react'
import Face from "./face"
import "./style.css"

export default function FaceSet(props)
{
	return (
		<div className="face__set--section flex__center--col">
			<div className="face__set--title">Type Face Color</div>
			<div className="face__set--body flex__center--row">
				<ul className="color__value--container">
					<div className="color__heading">Colors: </div>
					<li className="color__value"><b>g</b> = Green</li>
					<li className="color__value"><b>r</b> = Red</li>
					<li className="color__value"><b>w</b> = White</li>
					<li className="color__value"><b>y</b> = Yellow</li>
					<li className="color__value"><b>o</b> = Orange</li>
					<li className="color__value"><b>b</b> = Blue</li>
				</ul>
				<div className="face__set--container flex__center--row">
					<div className="face__info">
						<div className="face__name">Front Green Face</div>
							<Face side={props.colors.front} />
						<input name="front" type="text" className='color__input' placeholder='ggggggggg' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Right Red Face</div>
							<Face side={props.colors.right} />
						<input name="right" type="text" className='color__input' placeholder='rrrrrrrrr' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Upper White Face</div>
							<Face side={props.colors.upper} />
						<input name="upper" type="text" className='color__input' placeholder='wwwwwwwww' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Down Yellow Face</div>
							<Face side={props.colors.down} />
						<input name="down" type="text" className='color__input' placeholder='yyyyyyyyy' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Left Orange Face</div>
							<Face side={props.colors.left} />
						<input name="left" type="text" className='color__input' placeholder='ooooooooo' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Back Blue Face</div>
							<Face side={props.colors.back} />
						<input name="back" type="text" className='color__input' placeholder='bbbbbbbbb' onChange={props.handleChange}/>
					</div>
				</div>
				<div className="example__colors">
					<div className="example__color--heading">Example:</div>
					<ul className="example__list">
						<li className="example__item">ggggggggg</li>
						<li className="example__item">rrrrrrrrr</li>
						<li className="example__item">wwwwwwwww</li>
						<li className="example__item">yyyyyyyyy</li>
						<li className="example__item">ooooooooo</li>
						<li className="example__item">bbbbbbbbb</li>
					</ul>
				</div>
			</div>
			<button className="color__set--btn" onClick={props.handleClick}>Next</button>
		</div>
	);
}