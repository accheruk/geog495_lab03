mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    zoom: 5.25, // starting zoom
    center: [-119, 37] // starting center
});

async function geojsonFetch() {
    let response, fires, USA, table;
    response = await fetch('assets/fires.geojson');
    fires = await response.json();
    response = await fetch('assets/USA.json');
    USA = await response.json();
    table = document.getElementsByTagName("table")[0];
let row, cell1, cell2, cell3;
for (let i = 0; i < fires.features.length; i++) {
    // Create an empty <tr> element and add it to the 1st position of the table:
    row = table.insertRow(-1);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell1.innerHTML = fires.features[i].properties.Name;
    cell2.innerHTML = fires.features[i].geometry.coordinates;
    cell3.innerHTML = new Date(fires.features[i].properties.Updated).toLocaleDateString(
        "en-US");
}
//load data to the map as new layers and table on the side.
map.on('load', function loadingData() {

    map.addSource('fires', {
        type: 'geojson',
        data: fires
    });

    map.addLayer({
        'id': 'fires-layer',
        'type': 'circle',
        'source': 'fires',
        'paint': {
            'circle-radius': 2,
            'circle-stroke-width': 0.5,
            'circle-color': 'red',
            'circle-stroke-color': 'white'
        }
    });
    map.addSource('USA', {
        type: 'geojson',
        data: USA
    });

    map.addLayer({
        'id': 'USA-layer',
        'type': 'fill',
        'source': 'USA',
        'paint': {
            'fill-color': 'green',
            'fill-opacity': 0.5
        }
    });
   

});

let btn = document.getElementsByTagName("button")[1];

btn.addEventListener('click', sortTable);
// define the function to sort table
function sortTable(e) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = parseFloat(rows[i].getElementsByTagName("td")[1].innerHTML);
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
            //check if the two rows should switch place:
            if (x < y) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
};

geojsonFetch();
