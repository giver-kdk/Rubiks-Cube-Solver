import "./style.css";
import React, { useState } from "react";
import {useEffect} from "react"
import solver from "rubiks-cube-solver";

// import { Helmet } from "react-helmet";

function Solver(props) {
	// Cube Solving Logic
	let delay = 1000;
	let solverStyle = "";
	let [orientation, setOrientation] = useState({
		front: 1,
		right: 4,
		upper: 2,
		down: 3,
		left: 5,
		back: 0,
	});
	// let w = "u", g = "f", r = "r", o = "l", b = "b", y = "d";
	// let frontFace = [o, r, y, b, g, g, o, g, w].join("");
	// let rightFace = [r, y, w, y, r, w, r, o, w].join("");
	// let upperFace = [g, y, b, r, w, r, w, g, g].join("");
	// let downFace = [y, o, g, o, y, b, r, b, o].join("");
	// let leftFace = [y, b, b, r, o, w, y, w, b].join("");
	// let backFace = [r, o, o, g, b, w, g, y, b].join("");

	// let cubeState = [
	// frontFace, 
	// rightFace, 
	// upperFace,
	// downFace,
	// leftFace,
	// backFace
	// ].join('');
	
	// let solveMoves = solver(cubeState).split(" ");
	// console.log(solveMoves);
	useEffect(() => {
		let moveInstructions = [
			[4, true],
			[4, true],
			[4, true],
			[4, true],
		];
		// let scene = document.getElementById("scene");
		console.log("Script Ran");
		// var colors = ['blue', 'green', 'yellow', 'white', 'orange', 'red'],
		var colors = ["blue", "green", "white", "yellow", "red", "orange"],
			pieces = document.getElementsByClassName("piece");

		// Returns j-th adjacent face of i-th face
		function mx(i, j) {
			return (
				([2, 4, 3, 5][j % 4 | 0] +
					(i % 2) * (((j | 0) % 4) * 2 + 3) +
					2 * ((i / 2) | 0)) %
				6
			);
		}

		function getAxis(face) {
			return String.fromCharCode("X".charCodeAt(0) + face / 2); // X, Y or Z
		}

		// Moves each of 26 pieces to their places, assigns IDs and attaches stickers
		function assembleCube() {
			function moveto(face) {
				id = id + (1 << face);

				// pieces[i].children[face].appendChild(document.createElement('div'))
				// 	.setAttribute('class', 'sticker ' + colors[face]);
				pieces[i].children[face]
					.appendChild(document.createElement("div"))
					.setAttribute("class", "sticker " + colors[face]);

				return (
					"translate" +
					getAxis(face) +
					"(" +
					((face % 2) * 4 - 2) +
					"em)"
				);
			}
			for (var id, x, i = 0; (id = 0), i < 26; i++) {
				x = mx(i, i % 18);
				pieces[i].style.transform =
					"rotateX(0deg)" +
					moveto(i % 6) +
					(i > 5
						? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : "")
						: "");
				pieces[i].setAttribute("id", "piece" + id);
			}
		}

		function getPieceBy(face, index, corner) {
			return document.getElementById(
				"piece" +
					((1 << face) +
						(1 << mx(face, index)) +
						(1 << mx(face, index + 1)) * corner)
			);
		}

		// Swaps stickers of the face (by clockwise) stated times, thereby rotates the face
		function swapPieces(face, times) {
			for (var i = 0; i < 6 * times; i++) {
				var piece1 = getPieceBy(face, i / 2, i % 2),
					piece2 = getPieceBy(face, i / 2 + 1, i % 2);
				for (var j = 0; j < 5; j++) {
					var sticker1 =
							piece1.children[j < 4 ? mx(face, j) : face]
								.firstChild,
						sticker2 =
							piece2.children[j < 4 ? mx(face, j + 1) : face]
								.firstChild,
						className = sticker1 ? sticker1.className : "";
					if (className)
						(sticker1.className = sticker2.className),
							(sticker2.className = className);
				}
			}
		}

		// Animates rotation of the face (by clockwise if cw), and then swaps stickers
		function animateRotation(face, cw, currentTime) {
			var k = 0.3 * ((face % 2) * 2 - 1) * (2 * cw - 1),
				qubes = Array(9)
					.fill(pieces[face])
					.map(function (value, index) {
						return index
							? getPieceBy(face, index / 2, index % 2)
							: value;
					});
			(function rotatePieces() {
				var passed = Date.now() - currentTime,
					style =
						"rotate" +
						getAxis(face) +
						"(" +
						k * passed * (passed < 300) +
						"deg)";
				qubes.forEach(function (piece) {
					piece.style.transform = piece.style.transform.replace(
						/rotate.\(\S+\)/,
						style
					);
				});
				if (passed >= 300) return swapPieces(face, 3 - 2 * cw);
				requestAnimationFrame(rotatePieces);
			})();
		}

		// Events
		function mousedown(md_e) {
			// Side Rotation Logic
			var startXY = pivot.style.transform
					.match(/-?\d+\.?\d*/g)
					.map(Number),
				element = md_e.target.closest(".element"),
				face = [].indexOf.call(
					(element || cube).parentNode.children,
					element
				);
			function mousemove(mm_e) {
				if (element) {
					var gid = /\d/.exec(
						document.elementFromPoint(mm_e.pageX, mm_e.pageY).id
					);
					if (gid && gid.input.includes("anchor")) {
						mouseup();
						var e =
							element.parentNode.children[
								mx(face, Number(gid) + 3)
							].hasChildNodes();
						animateRotation(
							mx(face, Number(gid) + 1 + 2 * e),
							e,
							Date.now()
						);
						// console.log(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
					}
				}
				// Orientation change logic
				else
					pivot.style.transform =
						"rotateX(" +
						(startXY[0] - (mm_e.pageY - md_e.pageY) / 2) +
						"deg)" +
						"rotateY(" +
						(startXY[1] + (mm_e.pageX - md_e.pageX) / 2) +
						"deg)";
			}
			function mouseup() {
				document.body.appendChild(guide);
				scene.removeEventListener("mousemove", mousemove);
				document.removeEventListener("mouseup", mouseup);
				scene.addEventListener("mousedown", mousedown);
			}

			(element || document.body).appendChild(guide);
			scene.addEventListener("mousemove", mousemove);
			document.addEventListener("mouseup", mouseup);
			scene.removeEventListener("mousedown", mousedown);
		}
		function guide_moves(moveInstructions) {
			var startXYZ = pivot.style.transform
				.match(/-?\d+\.?\d*/g)
				.map(Number);
			let startX = 0;
			moveInstructions.map((move, index) => {
				setTimeout(() => {
					animateRotation(...move, Date.now());
					// pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1] + 90}deg) rotateZ(${startXYZ[2]}deg)`;
					// pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1] - 90}deg) rotateZ(${startXYZ[2]}deg)`;
					// pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2] - 90}deg)`;
					// pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2] + 90}deg)`;

					// To preserve 3D Perspective while rotating in X-axis, use rotate3d()
					// startX = startX + 90;
					// pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg) rotate3d(1,0,0,${startX}deg)`;

					// startX = startX - 90;
					// pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg) rotate3d(1,0,0,${startX}deg)`;
				}, 1000 * (index + 1));
			});
		}

		// Single Side Rotation Logic Functions
		function rotateFront(clockwise) {
			animateRotation(orientation.front, clockwise, Date.now());
		}
		function rotateRight(clockwise) {
			animateRotation(orientation.right, clockwise, Date.now());
		}
		function rotateUpper(clockwise) {
			animateRotation(orientation.upper, clockwise, Date.now());
		}
		function rotateDown(clockwise) {
			animateRotation(orientation.down, clockwise, Date.now());
		}
		function rotateLeft(clockwise) {
			animateRotation(orientation.left, clockwise, Date.now());
		}
		function rotateBack(clockwise) {
			animateRotation(orientation.back, clockwise, Date.now());
		}

		// Entire Cube Rotation Logic Functions
		var startXYZ = pivot.style.transform
				.match(/-?\d+\.?\d*/g)
				.map(Number);
		let startX = 0;
		function turnX(clockwise)
		{
			if(clockwise)
				startX = startX + 90;
			else
				startX = startX - 90;
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg) rotate3d(1,0,0,${startX}deg)`;
			setOrientation(prevOrientation =>
				{
					if(clockwise)
					{
						return {
							...prevOrientation,
							right: prevOrientation.upper,
							upper: prevOrientation.left,
							down: prevOrientation.right,
							left: prevOrientation.down
						};
					}
					else
					{
						return {
							...prevOrientation,
							right: prevOrientation.down,
							upper: prevOrientation.right,
							down: prevOrientation.left,
							left: prevOrientation.upper
						};
					}
				});
		}
		function turnY(clockwise)
		{
			if(clockwise)
				startXYZ[1] = startXYZ[1] - 90;
			else
				startXYZ[1] = startXYZ[1] + 90;
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg)`;
			setOrientation(prevOrientation =>
				{
					if(clockwise)
					{
						return {
							...prevOrientation,
							front: prevOrientation.right,
							right: prevOrientation.back,
							left: prevOrientation.front,
							back: prevOrientation.left
						};
					}
					else
					{
						return {
							...prevOrientation,
							front: prevOrientation.left,
							right: prevOrientation.front,
							left: prevOrientation.back,
							back: prevOrientation.right
						};
					}
				});
		}
		function turnZ(clockwise)
		{
			if(clockwise)
				startXYZ[2] = startXYZ[2] - 90;
			else
				startXYZ[2] = startXYZ[2] + 90;
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg)`;
			setOrientation(prevOrientation =>
				{
					if(clockwise)
					{
						return {
							...prevOrientation,
							front: prevOrientation.down,
							upper: prevOrientation.front,
							down: prevOrientation.back,
							back: prevOrientation.upper
						};
					}
					else
					{
						return {
							...prevOrientation,
							front: prevOrientation.upper,
							upper: prevOrientation.back,
							down: prevOrientation.front,
							back: prevOrientation.down
						};
					}
				});
		}

		// Dual Layer Rotation Logic Functions
		function rotateFrontDual(clockwise)
		{
			rotateBack(clockwise);
			setTimeout(() =>
			{
				turnX(clockwise);
			}, delay);
		}
		function rotateRightDual(clockwise)
		{
			rotateLeft(clockwise);
			setTimeout(() =>
			{
				turnZ(clockwise);
			}, delay);
		}
		function rotateUpperDual(clockwise)
		{
			rotateDown(clockwise);
			setTimeout(() =>
			{
				turnY(clockwise);
			}, delay);
		}
		function rotateDownDual(clockwise)
		{
			rotateUpper(clockwise);
			setTimeout(() =>
			{
				turnY(!clockwise);
			}, delay);
		}
		function rotateLeftDual(clockwise)
		{
			rotateRight(clockwise);
			setTimeout(() =>
			{
				turnZ(!clockwise);
			}, delay);
		}
		function rotateBackDual(clockwise)
		{
			rotateFront(clockwise);
			setTimeout(() =>
			{
				turnX(!clockwise);
			}, delay);
		}
		
		// Middle Layer Rotation Logic Functions
		function rotateM(clockwise)
		{
			rotateRight(clockwise);
			setTimeout(() =>
			{
				rotateLeft(!clockwise);
				setTimeout(() =>
				{
					turnZ(!clockwise);
				}, delay);
			}, delay);
		}
		function rotateE(clockwise)
		{
			rotateUpper(clockwise);
			setTimeout(() =>
			{
				rotateDown(!clockwise);
				setTimeout(() =>
				{
					turnY(!clockwise);
				}, delay);
			}, delay);
		}
		function rotateS(clockwise)
		{
			rotateFront(!clockwise);
			setTimeout(() =>
			{
				rotateBack(clockwise);
				setTimeout(() =>
				{
					turnX(clockwise);
				}, delay);
			}, delay);
		}

		// Solver Single Output to Cube Move Function 
		function applyMove(move)
		{
			let rotation = move[0];
			let clockwise = move.includes("2") ? true : move.includes("prime") ? false : true;

			let moveFunction = function findMove()
			{
				switch(rotation)
				{
					case "F":
						return rotateFront(clockwise);
					case "R":
						return rotateRight(clockwise);
					case "U":
						return rotateUpper(clockwise);
					case "D":
						return rotateDown(clockwise);
					case "L":
						return rotateLeft(clockwise);
					case "B":
						return rotateBack(clockwise);


					case "f":
						return rotateFrontDual(clockwise);
					case "r":
						return rotateRightDual(clockwise);
					case "u":
						return rotateUpperDual(clockwise);
					case "d":
						return rotateDownDual(clockwise);
					case "l":
						return rotateLeftDual(clockwise);
					case "b":
						return rotateBackDual(clockwise);


					case "M":
						return rotateM(clockwise);
					case "E":
						return rotateE(clockwise);
					case "S":
						return rotateS(clockwise);
					default: 
						console.log("Move Function Conversion Error");
				}
			}
			if(move.includes("2"))
			{
				moveFunction();
				setTimeout(() =>
				{
					moveFunction();
				}, delay);
			}
			else
			{
				moveFunction();
			}
		}
		setTimeout(() =>
		{
			applyMove(props.movesAlgo.reverseAlgo[0]);
		}, delay);
		document.ondragstart = function () {
			return false;
		};
		scene.addEventListener("mousedown", mousedown);
		assembleCube();
		// guide_moves(moveInstructions);
		// rotateRight(true);
	});
	// Example of interpreted move instruction

	// // Cube Face Input Logic
	// function setLoader()
	// {
	// 	props.tellLoadStatus();
	// 	// display_cube();
	// }
	// console.log(props.isLoaded);
	// if(props.isLoaded)
	// {
	// 	display_cube();
	// }

	// if(props.shouldShow)
	// {
	// 	solverStyle = " solver__active"
	// }

	return (
		<div className={`cube__container${solverStyle}`}>
			<div className="scene" id="scene">
				<div
					className="pivot centered"
					id="pivot"
					style={{
						transform:
							"rotateX(-35deg) rotateY(-135deg) rotateZ(0deg)",
					}}
				>
					<div className="cube" id="cube">
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>

						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
					</div>
				</div>
			</div>
			<div id="guide">
				<div
					className="anchor"
					id="anchor3"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-270deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor"
					id="anchor2"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-180deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor"
					id="anchor1"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-90deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor"
					id="anchor0"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(0deg) translateY(66.67%)",
					}}
				></div>
			</div>
			{/* <Helmet>
        		<script src="../src/components/solver/script.js" />
      		</Helmet> */}
		</div>
	);
}

export default Solver;
