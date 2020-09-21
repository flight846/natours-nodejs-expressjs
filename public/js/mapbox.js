export const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiZmxpZ2h0ODQ2IiwiYSI6ImNqdGR4N2szMzFjMnAzeXA0NjVkdWpia3IifQ.hZmxbuNog7WExbZOHhUQdg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/flight846/ckezsxy5l194z1an8u636z3zn',
        scrollZoom: false,
        // center: [-118.113491, 34.111745],
        // zoom: 10,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // add popup
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // extend map bounds to current locations
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
}