import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@fooloomanzoo/number-input/integer-input.js';
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
      displayCalendarSelection: Boolean,
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
          return [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
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
    this.displayCalendarSelection = false;
  }

  ready() {
    super.ready();
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --calendar-header-bkgnd: #FF675C;
          --calendar-header-forecolor: #fff8f7;
          --calendar-borders-color: #9c9a9b;
          --calendar-disabled-color: #ebebeb;
          --calendar-disabled-forecolor: #a8a8a8;
          --calendar-primary-selection-color: #519aed;
          --calendar-secondary-selection-color: #6fe657;
        }

        :host > * {
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer */
          -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
          -webkit-user-select: none; /* Chrome, Safari, and Opera */
          -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
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
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 60%;
          font-weight: bold;
          font-size: 18px;
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
          font-weight: bold;
        }

        .day {
          border-style: ridge;
          border-width: 0.7px;
        }
        .day-tag {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border-style: none;
          border-width: 1px;
          font-size: 18px;
        }

        .grid-item, .grid-item > div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .day:not(.disabled) {
          cursor: pointer;
        }

        .day:not(.disabled):not(.selected):hover {
          background-color: whitesmoke;
        }

        .disabled {
          background-color: var(--calendar-disabled-color);
          color: var(--calendar-disabled-forecolor);
        }

        #today > .day-tag {
          border-style: dashed;
          background-color: var(--calendar-secondary-selection-color);
          color: white;
        }

        .selected {
          background-color: var(--calendar-primary-selection-color);
          color: white;
        }

        .labels-container {
          border-style: solid;
          border-width: 0.7px;
          border-radius: 4px;
          margin-top: 5%;
        }

        .controls {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .controls > * {
          height: 75%;
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

          <template is="dom-if" if="[[displayCalendarSelection]]">
            <div class="controls">
              <paper-dropdown-menu id="month-selector">
                <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{selected_month}}">
                  <template is="dom-repeat" items="[[strfiedMonths]]" as="month">
                    <paper-item>[[month]]</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>
              <integer-input input="{{selected_year}}" step="1"></integer-input>
              <paper-button raised on-tap="_toggleCalendarSelection">
                <iron-icon icon="done"></iron-icon>
              </paper-button>
            </div>
          </template>
          <template is="dom-if" if="[[!displayCalendarSelection]]">
            <paper-button id="previous" on-tap="_moveBackward">
              <iron-icon icon="chevron-left"></iron-icon>
            </paper-button>

            <div class="title" on-tap="_toggleCalendarSelection">[[header_title]]</div>

            <paper-button id="next" on-tap="_moveForward">
              <iron-icon icon="chevron-right"></iron-icon>
            </paper-button>
          </template>

        </div>

        <div class="body">
          <div class="grid-container">
            <template is="dom-repeat" items="[[weekdays]]" as="weekday">
              <div class$="tag grid-item[[defineWeekdayDisabled(index)]]">
                <template is="dom-if" if="[[largeDevice]]">[[weekday]]</template>
                <template is="dom-if" if="[[!largeDevice]]">[[weekdayAbbr(weekday)]]</template>
              </div>
            </template>
            <template is="dom-repeat" items="[[displayed_days]]" as="displayed_day">
              <div id="[[displayed_day.el_id]]" class$="[[displayed_day.el_classes]]"
                on-tap="_selectDate" aria-label$="[[index]]">
                <div class="day-tag">[[displayed_day.n_day]]</div>
              </div>
            </template>
          </div>
        </div>

        <div class="labels-container">
        </div>
      </div>
    `;
  }
  
  getHeaderTitle(month, year) {
    return this.strfiedMonths[month] + ' '+ year;
  }

  getDisplayedDaysObj(month,year) {
    let today = new Date();
    today.setHours(0,0,0,0);
    let firstDay = new Date(year, month, 1);
    let weekDay = firstDay.getDay();
    let _date = firstDay.DateAdd("d", -weekDay);

    let displayDaysArr = [];
    for(let i=0; i<35; i++) {
      let properties = ['day', 'grid-item'];
      if(! (_date.getMonth() == month && _date.getDay() > 0 && _date.getDay() < 6))
        properties.push('disabled');

      displayDaysArr.push({
        n_day : _date.getDate(),
        el_id: (today.getTime() === _date.getTime())? "today" : "",
        el_classes : properties.join(" "),
      });

      _date = _date.DateAdd("d", 1);
    }
    return displayDaysArr;
  }

  _moveForward(eventArgs) {
    this.change_month("add");
  }
  
  _moveBackward(eventArgs) {
    this.change_month("substract");
  }

  _selectDate(eventArgs) {
    let selection = eventArgs.target;
    if(selection.getAttribute("class") == "day-tag")
      selection = selection.parentNode;

    let index = selection.getAttribute("aria-label");

    let classes = this.displayed_days[index].el_classes.split(" ");
    if(classes.includes("disabled"))
      return;
    if(classes.includes("selected"))
      classes.splice(classes.indexOf("selected"), 1);
    else
      classes.push("selected");
    this.set('displayed_days.'+index+'.el_classes', classes.join(" "));
  }

  _toggleCalendarSelection(eventArgs) {
    this.displayCalendarSelection = !this.displayCalendarSelection;
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

  defineWeekdayDisabled(weekday) {
      return weekday > 0 && weekday < 6? "" : " disabled";
  }
}

Object.defineProperty(Date.prototype, "DateAdd", {
  value: function DateAdd(interval, num) {
    let result = new Date(this.getTime());
    if(num == 0)
      return result;

    switch(interval) {
      case "d":
      case "D": {//Days
        result.setDate(result.getDate() + num)
        break;
      }
      case "w":
      case "W": {//Weekdays
        let i = Math.abs(num);
        let step = num > 0? 1 : -1;
        while(i > 0) {
          result.setDate(result.getDate() + step);
          let weekday = result.getDay();
          if(weekday > 0 && weekday < 6)
            i--;
        }
        break;
      }
      case "ww":
      case "WW": {
        result.setDate(result.getDate() + num * 7);
        break;
      }
      case "m":
      case "M": {
        let month = result.getMonth() + num;
        result = new Date(result.getFullYear(), month, result.getDate(), result.getHours(), result.getMinutes(), result.getSeconds());
        break;
      }
      case "y":
      case "Y": {
        let year = result.getFullYear() + num;
        result = new Date(year, result.getMonth(), result.getDate(), result.getHours(), result.getMinutes(), result.getSeconds());
        break;
      }
    }
    return result;
  },
  writable: true,
  configurable: true
});

window.customElements.define('mte-calendar', MteCalendar);
