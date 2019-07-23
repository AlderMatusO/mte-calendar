import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';

/**
 * `mte-calendar`
 * Multi task/event calendar component
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MteCalendar extends PolymerElement {
  static get properties() {
    return {
      largeDevice: Boolean,
      strfiedMonths: {
        type: Array,
        value() { 
          return [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ]
        }
      },
      weekdays: {
        type: Array,
        value() {
          return [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
          ]
        }
      },
      selected_month: {
        type: Number
      },
      selected_year: {
        type: Number
      },
      header_title: {
        type: String,
        computed: 'getHeaderTitle(selected_month,selected_year)'
      },
      displayed_days: {
        type: Object,
        computed: 'getDisplayedDaysObj(selected_month,selected_year)'
      }
    };
  }
  
  constructor() {
    super();

    let today = new Date();
    this.selected_month = today.getMonth();
    this.selected_year = today.getFullYear();
  }

  ready() {
    super.ready();
    console.log(this.largeDevice);
    this.weekdays.forEach( (item) => {
      console.log(item.substring(0,2));
    });
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --calendar-header-bkgnd: #FF675C;
          --calendar-header-forecolor: #fff8f7;
          --calendar-borders-color: #9c9a9b;
        }

        .header {
          display: flex;
          flex-direction: row;
          background-color: var(--calendar-header-bkgnd);
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
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

        .body {
          position: relative;
          border-style: none solid solid solid;
          border-width: 1px;
          border-color: var(--calendar-borders-color);
          border-bottom-right-radius: 4px;
          border-bottom-left-radius: 4px;
          z-index: 0;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(7, 14.2%);
          margin:  0 1.5% 1.8% 1.5%;
        }

        .tag {
          color: #4FC8ED;
          font-size: 8px;
        }

        .day {
          font-size: 16px;
          border-style: dotted;
          border-width: 1px;
        }

        .grid-item {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sunday-shadow,.saturday-shadow {
          position: absolute;
          height: 97%;
          width: 14%;
          top: 0.2%;
          background-color: #FFDD30;
          opacity: 0.3;
          z-index: 2;
        }

        .sunday-shadow {
          left: 1.4%;
        }
        
        .saturday-shadow {
          left: 84%;
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

          .day {
            font-size: 20px;
            height: 50px;
          }

          .tag {
            font-size: 12px;
            height: 25px;
          }
        }

      </style>
      <iron-media-query query="(min-width: 768px)" query-matches="{{largeDevice}}"></iron-media-query>
      <div class="calendar">
        <div class="header">
          <paper-button id="previous" on-click="move_backward">
            <iron-icon icon="chevron-left"></iron-icon>
          </paper-button>
          
          <div class="title">[[header_title]]</div>

          <paper-button id="next" on-click="move_forward">
            <iron-icon icon="chevron-right"></iron-icon>
          </paper-button>
          
        </div>

        <div class="body">
          <div class="sunday-shadow"></div>
          <div class="saturday-shadow"></div>
          <div class="grid-container">
            <template is="dom-repeat" items="[[weekdays]]">
              <div class="tag grid-item">
                <template is="dom-if" if="[[largeDevice]]">[[item]]</template>
                <template is="dom-if" if="[[!largeDevice]]">[[weekdayAbbr(item)]]</template>
              </div>
            </template>
            <template is="dom-repeat" items="[[displayed_days]]">
              <div class="day grid-item">
                [[item]]
              </div>
            </template>
          </div>
        </div>
      </div>
    `;
  }
  
  getHeaderTitle(month, year) {
    return this.strfiedMonths[month] + ' '+ year;
  }

  getDisplayedDaysObj(month,year) {

    let curMonthLastD = new Date(year, (month < 11 ? month + 1 : 0), 0);
    let firstWeekday = new Date(year, month, 1).getDay();
    let len_prevMonth = new Date(year, month, 0).getDate();

    let prevMonthDaysArr = [];
    for(let i = len_prevMonth - (firstWeekday - 1); i <= len_prevMonth; i++ )
      prevMonthDaysArr.push(i);

    return Array.prototype.concat(prevMonthDaysArr, new Array(curMonthLastD.getDate())
    .fill(undefined).map((_, i) => i + 1));
  }

  move_forward(eventArgs) {
    this.change_month("add");
  }
  
  move_backward(eventArgs) {
    this.change_month("substract");
  }

  change_month(operation) {
    if(operation == "add")
    {
      if(this.selected_month < 11)
        this.selected_month++;
      else{
        this.selected_month = 0;
        this.selected_year++;
      }
    }
    if(operation == "substract")
    {
      if(this.selected_month > 0)
        this.selected_month--;
      else{
        this.selected_month = 11;
        this.selected_year--;
      }
    }
  }

  weekdayAbbr( weekday ) {
    return weekday.substring(0,2);
  }
}

window.customElements.define('mte-calendar', MteCalendar);
