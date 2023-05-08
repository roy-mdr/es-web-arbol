<script lang="ts">
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { writeTextFile } from '$lib/util/fileMgmt';

	import { mainTree } from '$lib/stores/mainTree';

	onMount(() => {
		initD3();
		import('makerjs').then((mjs) => {
			makerjs = mjs;
		});
	});

	const mtData = structuredClone(get(mainTree));

	const radiusScaleFactor = 2;

	const margin = { top: 20, right: 90, bottom: 30, left: 90 };
	const duration = 750;

	let width;
	let height;
	let i = 0;
	let root;
	let treemap;
	let svg;

	let makerjs;

	function saveSVG() {
		let domSVG = document.getElementById('svgOut').getElementsByTagName('svg')[0];

		const styleGraph = document.createElement('style');
		styleGraph.innerHTML = `
.node circle {
	fill: #fff;
	stroke: steelblue;
	stroke-width: 3px;
}

.node text {
	font: 12px sans-serif;
}

.link-path {
	fill: none;
	stroke: #ccc;
	stroke-width: 2px;
}`;

		const vSVG = domSVG.cloneNode(true);
		vSVG.insertBefore(styleGraph, vSVG.children[0]);

		vSVG.querySelectorAll('.link').forEach((el) => {
			el.classList.remove('link');
			el.classList.add('link-path');
		});

		writeTextFile(vSVG.outerHTML, 'sysTree-sized_tree', '.svg');
	}

	function saveDXF() {
		var model = {};
		var svg = document.getElementById('svgOut').getElementsByTagName('svg')[0];

		var svgEls = svg.querySelectorAll('circle.node, path.link');

		for (var i = 0; i < svgEls.length; i++) {
			let el;

			switch (svgEls[i].tagName) {
				case 'circle':
					var circle = svgEls[i];
					// var origin = [+circle.getAttribute('cx'), +circle.getAttribute('cy')];
					var origin = [+circle.parentElement.__data__.y, +circle.parentElement.__data__.x];
					var radius = +circle.getAttribute('r') / radiusScaleFactor;

					el = new makerjs.paths.Circle(origin, radius);
					// el.layer = circle.getAttribute('stroke');
					el.layer = 'nodes';

					break;

				case 'path':
					var path = svgEls[i];
					var coord = path.getAttribute('d').match(/\d+(\.\d+)?/g);
					var origin = [+coord[coord.length - 2], +coord[coord.length - 1]];
					var end = [+coord[0], +coord[1]];

					el = new makerjs.paths.Line(origin, end);
					el.layer = 'links';

					break;
			}

			makerjs.model.addPath(model, el);
		}

		writeTextFile(makerjs.exporter.toDXF(model), 'sysTree-sized_tree', '.dxf');
	}

	function initD3() {
		// Set the dimensions and margins of the diagram
		width = window?.innerWidth - margin.left - margin.right;
		height = window?.innerHeight - margin.top - margin.bottom;

		// append the svg object to the body of the page
		// appends a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		svg = d3
			.select('#svgOut')
			.append('svg')
			.attr('width', width + margin.right + margin.left)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// declares a tree layout and assigns the size
		treemap = d3.tree().size([height, width]);

		loadData();
	}

	// load the external data
	function loadData() {
		// Assigns parent, children, height, depth
		root = d3.hierarchy(mtData, function (d) {
			return d.children;
		});
		root.x0 = height / 2;
		root.y0 = 0;

		// Collapse after the second level
		root?.children?.forEach(collapse);
		/* root.children.forEach((d) => {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			}
		}); */

		update(root);
	}

	// Collapse the node and all it's children
	function collapse(d) {
		if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}

	function update(source) {
		// Assigns the x and y position for the nodes
		var treeData = treemap(root);

		// Compute the new tree layout.
		var nodes = treeData.descendants(),
			links = treeData.descendants().slice(1);

		// Normalize for fixed-depth.
		nodes.forEach(function (d) {
			d.y = d.depth * 180;
		});

		// ****************** Nodes section ***************************

		// Update the nodes...
		var node = svg.selectAll('g.node').data(nodes, function (d) {
			return d.id || (d.id = ++i);
		});

		// Enter any new modes at the parent's previous position.
		var nodeEnter = node
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', function (d) {
				return 'translate(' + source.y0 + ',' + source.x0 + ')';
			})
			.on('click', click);

		// Add Circle for the nodes
		nodeEnter
			.append('circle')
			.attr('class', 'node')
			.attr('r', 1e-6)
			.style('fill', function (d) {
				return d._children ? 'lightsteelblue' : '#fff';
			});

		// Add labels for the nodes
		nodeEnter
			.append('text')
			.attr('dy', '.35em')
			.attr('x', function (d) {
				return d.children || d._children ? -13 : 13;
			})
			.attr('text-anchor', function (d) {
				return d.children || d._children ? 'end' : 'start';
			})
			.text(function (d) {
				return `${
					d.data.name
				} (${Math.round(d.data.sumfactor ? d.data.sumfactor : d.data.area) || 0}m2)`;
			});

		// UPDATE
		var nodeUpdate = nodeEnter.merge(node);

		// Transition to the proper position for the node
		nodeUpdate
			.transition()
			.duration(duration)
			.attr('transform', function (d) {
				return 'translate(' + d.y + ',' + d.x + ')';
			});

		// Update the node attributes and style
		nodeUpdate
			.select('circle.node')
			.attr('r', (d) => {
				return (
					radiusScaleFactor *
					(d.data.area ? Math.sqrt(d.data.area / Math.PI) : Math.sqrt(d.data.sumfactor / Math.PI))
				);
			})
			.style('fill', function (d) {
				return d._children ? (d.data.color ? d.data.color : 'lightsteelblue') : '#fff';
			})
			.attr('cursor', 'pointer');

		// Remove any exiting nodes
		var nodeExit = node
			.exit()
			.transition()
			.duration(duration)
			.attr('transform', function (d) {
				return 'translate(' + source.y + ',' + source.x + ')';
			})
			.remove();

		// On exit reduce the node circles size to 0
		nodeExit.select('circle').attr('r', 1e-6);

		// On exit reduce the opacity of text labels
		nodeExit.select('text').style('fill-opacity', 1e-6);

		// ****************** links section ***************************

		// Update the links...
		var link = svg.selectAll('path.link').data(links, function (d) {
			return d.id;
		});

		// Enter any new links at the parent's previous position.
		var linkEnter = link
			.enter()
			.insert('path', 'g')
			.attr('class', 'link')
			.attr('d', function (d) {
				var o = { x: source.x0, y: source.y0 };
				return diagonal(o, o);
			});

		// UPDATE
		var linkUpdate = linkEnter.merge(link);

		// Transition back to the parent element position
		linkUpdate
			.transition()
			.duration(duration)
			.attr('d', function (d) {
				return diagonal(d, d.parent);
			});

		// Remove any exiting links
		var linkExit = link
			.exit()
			.transition()
			.duration(duration)
			.attr('d', function (d) {
				var o = { x: source.x, y: source.y };
				return diagonal(o, o);
			})
			.remove();

		// Store the old positions for transition.
		nodes.forEach(function (d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});

		// Creates a curved (diagonal) path from parent to the child nodes
		function diagonal(s, d) {
			const path = `M ${s.y} ${s.x}
 C ${(s.y + d.y) / 2} ${s.x},
 ${(s.y + d.y) / 2} ${d.x},
 ${d.y} ${d.x}`;

			return path;
		}

		// Toggle children on click.
		function click(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
			update(d);
		}
	}
</script>

<button type="button" on:click={saveSVG}>SAVE SVG</button>
<button type="button" on:click={saveDXF}>SAVE DXF</button>
<div id="dxf" />
<div id="svgOut" />

<style>
	#svgOut :global(.node circle) {
		fill: #fff;
		stroke: steelblue;
		stroke-width: 3px;
	}

	#svgOut :global(.node text) {
		font: 12px sans-serif;
	}

	#svgOut :global(.link) {
		fill: none;
		stroke: #ccc;
		stroke-width: 2px;
	}
</style>
