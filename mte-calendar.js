import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `mte-calendar`
 * Multi task/event calendar component
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MteCalendar extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'mte-calendar',
      },
    };
  }
}

window.customElements.define('mte-calendar', MteCalendar);
