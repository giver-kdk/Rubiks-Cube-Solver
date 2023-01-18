import React from 'react'
import { useState } from "react";
import { useEffect } from "react";
import "./cube.css"

export default function CubeRotate()
{
	// Start reverse and forward algorithm animation after component is mounted
	useEffect(() => {
		console.log("Script Started");
		// Create color array by matching its index with "orientation" value
		var colors = ["blue", "green", "white", "yellow", "red", "orange"],
			pieces = document.getElementsByClassName("piece__s");

		// Returns j-th adjacent face of i-th face
		function mx(i, j) {
			return (
				([2, 4, 3, 5][j % 4 | 0] +
					(i % 2) * (((j | 0) % 4) * 2 + 3) +
					2 * ((i / 2) | 0)) %
				6
			);
		}
		// Get face axis for rotation: X, Y or Z
		function getAxis(face) {
			return String.fromCharCode("X".charCodeAt(0) + face / 2); 
		}

		// Moves each of 26 pieces to their places, assigns IDs and attaches stickers
		function assembleCube() {
			function moveto(face) {
				id = id + (1 << face);
				pieces[i].children[face]
					.appendChild(document.createElement("div"))
					.setAttribute("class", "sticker__s " + colors[face]);
				// Move repective pieces to their position
				return (
					"translate" +
					getAxis(face) +
					"(" +
					((face % 2) * 4 - 2) +
					"em)"
				);
			}
			// Orient respective pieces using rotation
			for (var id, x, i = 0; (id = 0), i < 26; i++) {
				x = mx(i, i % 18);
				pieces[i].style.transform =
					"rotateX(0deg)" +
					moveto(i % 6) +
					(i > 5
						? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : "")
						: "");
				pieces[i].setAttribute("id", "piece__s" + id);
			}
		}
		document.ondragstart = function () {
			return false;
		};
		assembleCube();
		return () =>
		{
			console.log("Start Component Unmounted");

		}
	}, []);
	return (
		<div className="rotating__cube--start">
			<div className="scene__s" id="scene__s">
				<div
					className="pivot__s centered__s"
					id="pivot__s"
				>
					<div className="cube__s" id="cube__s">
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>

						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
						<div className="piece__s">
							<div className="element__s left__s"></div>
							<div className="element__s right__s"></div>
							<div className="element__s top__s"></div>
							<div className="element__s bottom__s"></div>
							<div className="element__s back__s"></div>
							<div className="element__s front__s"></div>
						</div>
					</div>
				</div>
			</div>
			<div id="guide__s">
				<div
					className="anchor__s"
					id="anchor__s3"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-270deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor__s"
					id="anchor__s2"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-180deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor__s"
					id="anchor__s1"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-90deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor__s"
					id="anchor__s0"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(0deg) translateY(66.67%)",
					}}
				></div>
			</div>
		</div>
	);
}