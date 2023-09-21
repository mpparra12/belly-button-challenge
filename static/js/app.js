const DATA_URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function fetchData(endpoint) {
    return d3.json(DATA_URL);
}

function init() {
    let dropdownMenu = d3.select("#selDataset");

    fetchData().then(data => {
        populateDropdown(data.names, dropdownMenu);
        renderDashboard(data.names[0]);
    });
}

function populateDropdown(names, menu) {
    names.forEach(id => {
        menu.append("option")
            .text(id)
            .property("value", id);
    });
}

function renderDashboard(sample) {
    buildMetadata(sample);
    buildBarChart(sample);
    buildBubbleChart(sample);
    buildGaugeChart(sample);
}

function buildMetadata(sample) {
    fetchData().then(data => {
        let metadata = data.metadata;
        let filteredData = metadata.find(result => result.id == sample);
        displayMetadata(filteredData);
    });
}

function displayMetadata(data) {
    let panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(data).forEach(([key, value]) => {
        panel.append("h5").text(`${key}: ${value}`);
    });
}

function buildBarChart(sample) {
    fetchData().then(data => {
        let samples = data.samples;
        let sampleData = samples.find(s => s.id == sample);

        let yticks = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xticks = sampleData.sample_values.slice(0, 10).reverse();
        let labels = sampleData.otu_labels.slice(0, 10).reverse();

        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        Plotly.newPlot("bar", [trace], { title: "Top 10 OTUs Present" });
    });
}

function buildBubbleChart(sample) {
    fetchData().then(data => {
        let samples = data.samples;
        let sampleData = samples.find(s => s.id == sample);

        let trace = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            }
        };

        Plotly.newPlot("bubble", [trace], {
            title: "Results Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" }
        });
    });
}

init();