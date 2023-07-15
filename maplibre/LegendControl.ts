export default class LegendControl {
  _btn: HTMLButtonElement;
  _container: HTMLDivElement;

  constructor() {}

  onAdd() {
    this._btn = document.createElement('button');
    this._btn.className = 'maplibregl-info maplibregl-ctrl-icon';
    this._btn.type = 'button';
    this._btn.title = 'Légende';
    this._btn.onclick = () => {
      window.alert('la légende arrive bientôt !');
      // const legend = document.getElementById('legend');
      // if (!legend) {
      //   return;
      // }
      // const classList = Array.from(legend.classList);
      // const isLegendHidden = classList.includes('hidden');
      // if (isLegendHidden) {
      //   legend.classList.remove('hidden');
      // } else {
      //   legend.classList.add('hidden');
      // }
    };

    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl-group mapbox-ctrl-group maplibregl-ctrl mapboxgl-ctrl';
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}
