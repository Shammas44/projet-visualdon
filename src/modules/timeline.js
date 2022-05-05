import * as d3 from "d3";
let _barCount = 21;
let _strokeWidth = 2;
let _numberOfSpace = _barCount - 1;
const _itemCount = _numberOfSpace + _barCount;
let lastMatchs = [];
let lastId = 0;
const getWidth = () => {
	const clientWidth = parseInt(document.body.clientWidth);
	const factor = clientWidth > 1000 ? 40 : 10;
	const margin = (clientWidth / 100) * factor;
	const w = parseInt(document.documentElement.clientWidth) - margin;
	return (w / _itemCount) % 2 === 0 ? w / _itemCount : w / _itemCount + 1;
};
let _width = getWidth();
let _svgWidth = _width * _numberOfSpace + _width * _barCount + _strokeWidth;

window.addEventListener("resize", () => {
	_width = getWidth();
	_svgWidth = _width * _numberOfSpace + _width * _barCount + _strokeWidth;
	svg.attr("width", _svgWidth);
	buildTimeline(lastMatchs, lastId);
});

const svg = d3.select("#svg").attr("width", _svgWidth).attr("height", "100%");

export function buildTimeline(matchs, id) {
	const y = 10;
	lastMatchs = matchs;
	lastId = id;
	const stats = [
		{
			class: "victory",
			color: "rgba(0, 255, 0, 0.1)",
			colorCurrent: "rgba(0, 255, 0, 0.5)",
			y: (d) => y,
			height: (d) => (parseInt(d.victory) == 0 ? 1 : parseInt(d.victory)),
		},
		{
			class: "defeat",
			color: "rgba(255, 0, 0, 0.1)",
			colorCurrent: "rgba(255, 0, 0, 0.5)",
			y: (d) => parseInt(d.victory) + y,
			height: (d) => parseInt(d.defeat),
		},
		{
			class: "egality",
			color: "white",
			colorCurrent: "white",
			y: (d) => parseInt(d.victory) + parseInt(d.defeat) + y,
			height: (d) => parseInt(d.egality),
		},
	];

	const setStyle = (matchId, stat) => {
		if (id == matchId) {
			return "transform:rotate(1turn);";
		} else {
			return stat.class == "victory"
				? "transform:rotate(1turn);"
				: "transform:rotate(-1turn);display:none;";
		}
	};

	for (const stat of stats) {
		svg
			.selectAll(`.${stat.class}`)
			.data(matchs)
			.join(
				(enter) =>
					enter
						.append("rect")
						.attr("class", stat.class)
						.attr("x", (d, i) => i * _width * 2 + _strokeWidth / 2)
						.attr("y", (d) => stat.y(d))
						.attr("width", (d, i) => _width)
						.attr("height", (d) => stat.height(d))
						.attr("fill", (d) => (d.id == id ? stat.colorCurrent : stat.color))
						.attr("data-id", (d, i) => i)
						.attr("style", (d, i) => setStyle(d.id, stat))
						.text((d, i) => d.id),
				(update) =>
					update
						.transition()
						.duration(500)
						.attr("height", (d) => stat.height(d))
						.attr("width", (d, i) => _width)
						.attr("style", (d, i) => setStyle(d.id, stat))
						.attr("y", (d) => stat.y(d))
						.attr("x", (d, i) => i * _width * 2 + _strokeWidth / 2)
						.attr("fill", (d) => (d.id == id ? stat.colorCurrent : stat.color))
						.attr("data-id", (d, i) => i)
						.text((d, i) => d.id),
				(exit) => exit.attr("height", (d) => 0).remove()
			)
			.attr("stroke", "black")
			.attr("stroke-width", _strokeWidth);
	}
}
