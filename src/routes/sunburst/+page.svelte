<script lang="ts">
	import { get } from 'svelte/store';
	import { assets } from '$app/paths';

	import { mainTree } from '$lib/stores/mainTree';

	let data = get(mainTree);

	let chartContainer: HTMLElement;
	let doPercent = true;

	let sunChart: any;

	const initializeSunburst = () => {
		if (typeof Sunburst == 'undefined') return;
		if (typeof sunChart !== 'undefined') return;

		sunChart = Sunburst()
			// .data(data)
			.width(window.innerWidth)
			.height(window.innerHeight)
			.children('children')
			.label('name')
			.size('area')
			.centerRadius(0.1)
			// .sumpercent(true) // adds up the value + percentage
			.sumfactor(doPercent ? 'factor' : false) // adds up the value + percentage
			.sort((a, b) => b.value - a.value) // sort descending by size
			// .color((d, parent) => d.name == 'SERVICIOS' ? '#333' : '#AAA')
			.color((d, parent) => (d.color ? d.color : color(d, parent ? parent : null)))
			.tooltipContent((d, node) => `Area: <i>${Math.round(node.value * 100) / 100}m2</i>`);
		// .tooltipContent((d, node) => `Size: <i>${d.size || Math.round( d.sumfactor *100)/100}m2</i>`)
		// (document.getElementById('chart'))
	};

	function color_intensity(hex: string, steps: number) {
		// strip the leading # if it's there
		hex = hex.replace(/^\s*#|\s*$/g, '');

		// convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
		if (hex.length == 3) {
			hex = hex.replace(/(.)/g, '$1$1');
		}

		var r = parseInt(hex.substring(0, 2), 16),
			g = parseInt(hex.substring(2, 4), 16),
			b = parseInt(hex.substring(4, 6), 16);

		return (
			'#' +
			(0 | ((1 << 8) + Math.min(Math.max(r + steps, 0), 255))).toString(16).substring(1) +
			(0 | ((1 << 8) + Math.min(Math.max(g + steps, 0), 255))).toString(16).substring(1) +
			(0 | ((1 << 8) + Math.min(Math.max(b + steps, 0), 255))).toString(16).substring(1)
		);
	}

	const color = (d, parent) => {
		if (parent != null) {
			if (!parent.data.color) {
				parent.data.color = '#000';
			}
			d.color = color_intensity(parent.data.color, 32);
		}
	};

	function toggleDisplayFactor(trigger: any) {
		if (!sunChart) return;
		sunChart.sumfactor(doPercent ? 'factor' : false) /*.data(data)*/;
	}

	function initRendering(triggerA: any, triggerB: any) {
		initializeSunburst();
		if (!sunChart) return;
		if (!chartContainer) return;

		sunChart(chartContainer).data(data);
	}

	$: toggleDisplayFactor(doPercent);
	$: initRendering(sunChart, chartContainer);
</script>

<!-- The "on:load={initializeSunburst}" kinda does nothing" -->
<svelte:head>
	<script defer src="{assets}/d3.min.js"></script>
	<script defer src="{assets}/sunburst-chart.js" on:load={initializeSunburst}></script>
</svelte:head>

<label style="position: absolute;">
	<input type="checkbox" id="doPercent" bind:checked={doPercent} />
	<span>Calcular circulaci&oacute;n</span>
</label>

<div id="chart" bind:this={chartContainer} />
