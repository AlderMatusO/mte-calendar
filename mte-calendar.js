import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';

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
          --calendar-header-bkgnd: #FF675C;
          --calendar-header-forecolor: #fff8f7;
        }

        .header {
          display: flex;
          flex-direction: row;
          background-color: var(--calendar-header-bkgnd);
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          height: 30px;
          padding-top: 5px;
          padding-bottom: 5px;
        }

        .header > * {
          color: var(--calendar-header-forecolor);
        }
        
        .title {
          min-width: 60%;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          margin-top: 1.5%;
        }

        #previous,#next {
          min-width: 20%;
          margin:0;
        }

        .header paper-button iron-icon {
          min-width: 100%;
        }

        @media(min-width: 425px)
        {
          .header {
            height: 60px;
            padding-top: 5px;
            padding-bottom: 5px;
          }

          .title {
            min-width: 80%;
            font-size: 24px;
            margin-top: 3%;
          }

          #previous,#next {
            min-width: 10%;
            margin:0;
          }

        }

      </style>
      
      <div class="calendar">
        <div class="header">
          <paper-button id="previous">
            <iron-icon icon="chevron-left"></iron-icon>
          </paper-button>
          
          <div class="title">{{header_title}}</div>

          <paper-button id="next">
            <iron-icon icon="chevron-right"></iron-icon>
          </paper-button>
          
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      strfiedMonths: {
        type: Array,
        value: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]
      },
      the_date: {
        type: Object,
        value: new Date(),
      },
      header_title: {
        type: String,
        computed: 'getHeaderTitle(the_date)'
      }

    };
  }

  getHeaderTitle(date) {
    return this.strfiedMonths[date.getMonth()] + ' '+ date.getFullYear();
  }
}

window.customElements.define('mte-calendar', MteCalendar);
