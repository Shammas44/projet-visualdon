import * as d3 from "d3";

const svg = d3.select("#svg");

const WIDTH = 10;

export function buildTimeline(matchs, currentId) {
	const y = 10;
	const stats = [
		{
			class: "victory",
			color: "green",
			y: (d) => y,
			height: (d) => parseInt(d.victory),
		},
		{
			class: "defeat",
			color: "red",
			y: (d) => parseInt(d.victory) + y,
			height: (d) => parseInt(d.defeat),
		},
		{
			class: "egality",
			color: "black",
			y: (d) => parseInt(d.victory) + parseInt(d.defeat) + y,
			height: (d) => parseInt(d.egality),
		},
	];

	const isBeforeCurrentId = (id) => (currentId - 1 == id ? true : false);
	const isAfterCurrentId = (id) => (currentId + 1 == id ? true : false);
	const setWidth = (d) => (d.id == currentId ? WIDTH * 2 : WIDTH);
	const setX = (d, i) => {
		if (d.id == currentId) {
			return i * WIDTH * 4;
		} else if (isAfterCurrentId(d.id)) {
			console.log("isAfterCurrentId");
			return i * WIDTH * 6;
		} else {
			return i * WIDTH * 2;
		}
	};

	for (const stat of stats) {
		console.log(stat);
		svg
			.selectAll(`.${stat.class}`)
			.data(matchs)
			.join(
				(enter) =>
					enter
						.append("rect")
						.attr("class", stat.class)
						.attr("x", (d, i) => i * WIDTH * 2)
						.attr("y", (d) => stat.y(d))
						.attr("width", (d, i) => WIDTH)
						.attr("height", (d) => stat.height(d))
						.attr("fill", stat.color)
						.attr("data-id", (d, i) => i)
						.attr("style", "transform:rotate(1turn);"),
				(update) =>
					update
						.transition()
						.duration(1000)
						.attr("height", (d) => stat.height(d))
						.attr("y", (d) => stat.y(d)),
				(exit) => exit.attr("width", (d) => 0).remove()
			);
	}
}
