const DATA_URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let allData;

function fetchData(endpoint) {
    return d3.json(DATA_URL);
}

function init() {
    fetchData().then(data => {
        console.log("Fetched data:", data);

        allData = data; 
        populateDropdown(data.names, d3.select("#selDataset"));
        renderDashboard(data.names[0]);

        d3.select("#selDataset").on("change", function() {
            let newSample = d3.select(this).property("value");
            renderDashboard(newSample);
        });
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
    console.log("Rendering dashboard for sample:", sample);
    buildMetadata(sample);
    buildBarChart(sample);
    buildBubbleChart(sample);
}

function buildMetadata(sample) {
    let data = allData;
        let metadata = data.metadata;
        let filteredData = metadata.find(result => String(result.id) === String(sample));
        displayMetadata(filteredData);
}

function displayMetadata(data) {
    let panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(data).forEach(([key, value]) => {
        panel.append("h5").text(`${key}: ${value}`);
    });
}

function buildBarChart(sample) {
    let data = allData;
        let samples = data.samples;
        let sampleData = samples.find(s => String(s.id) === String(sample));

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
}

function buildBubbleChart(sample) {
    let data = allData;
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
}

init();