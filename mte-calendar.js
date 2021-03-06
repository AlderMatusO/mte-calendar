import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './custom/components/day-item.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu-light.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
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
      _readonly: {
        type: Boolean,
        value() { return false; }
      },
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
      evt_types: {
        type: Object,
        value() {
          return {
            selection : { color: "#519aed", min_date: '31-december-1979', max_date: '31-december-2030', restrictWeekdays: true }
          };
        }
      },
      evt_types_keys: {
        type: Array,
        computed: 'getEventTypesKeys()'
      },
      cur_event: {
        type: String,
        value() {
          return 'selection'
        }
      },
      header_title: {
        type: String,
        computed: 'getHeaderTitle(selected_month,selected_year)'
      },
      displayed_days: {
        type: Object,
        computed: 'getDisplayedDaysObj(selected_month,selected_year,cur_event)'
      },
      showIndicators: {
        type: Boolean,
        computed: 'hasIndicators(evt_types)'
      }
    };
  }
  
  constructor() {
    super();

    let today = new Date();
    this.selected_month = today.getMonth();
    this.selected_year = today.getFullYear();
    this.displayCalendarSelection = false;

    Object.defineProperty(this, "readonly", {
      get: function() { return this._readonly; }
    });
  }

  ready() {

    let events = Object.keys(this.evt_types);
    if(events != undefined) {
      this.cur_event = events[0];
      //Define a _dates property to every event in evt_types Object
      //to handle getting and setting on the dates array.
      let $calendar = this;
      events.forEach((evt) => {
        Object.defineProperty(this.evt_types[evt], "dates", {
          get: function() {
            return this._dates.map((_time) => (new Date(_time)).toCustomFormat());
          },
          set: function(datesArr) {
            if(!Array.isArray(datesArr))
              return;
            [...$calendar.evt_types[evt]._dates].forEach((date) => {
              $calendar.deselectEventDate(evt, date);
            });

            datesArr.forEach((data) => {
              var _date;
              if(Object.prototype.toString.call(data) === '[object Date]') {
                _date = data.getTime();
              }
              if(typeof data === 'string' && Date.parse(data) != NaN) {
                _date = new Date(data).getTime();
              }
              if(typeof data === 'number') {
                _date = data;
              }
              $calendar.selectEventDate(evt, _date);
            });
            // If the calendar is set to readonly, it should change the current
            // displayed month/year to show the min date after changes in event date arrays.
            if($calendar._readonly) {
              $calendar.displayMinDate();
            }
          }
        });

        if(!this.evt_types[evt].hasOwnProperty("_dates"))
          this.evt_types[evt]._dates = [];
      });
    }

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

          /* no underline */
          --paper-dropdown-menu-input: {
            font-size: 14px;
            padding: 0;
            font-weight: bold;
            color: var(--calendar-header-forecolor);
            border-bottom: none;
          };
          --paper-dropdown-menu-icon: {
            border-color: var(--calendar-header-forecolor);
            color: var(--calendar-header-forecolor);
          };
          --paper-dropdown-menu-focus-color: var(--calendar-header-forecolor);

          --paper-input-container-input: {
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            color: var(--calendar-header-forecolor);
            border-bottom: none;
            padding: 2%;
          };

          --paper-input-container-underline: { display: none; height: 0; };
          --paper-input-container-underline-focus: { border-color: var(--calendar-header-forecolor); };
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

        #previous,#next {
          min-width: 20%;
          margin:0;
        }

        .title {
          min-width: 60%;
          font-weight: bold;
          font-size: 18px;
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
        
        .bordered {
          border-style: solid;
          border-width: 0.7px;
          border-radius: 4px;
          border-color: var(--calendar-borders-color);
        }

        .labels-container {
          margin-top: 5%;
          padding: 3%;
        }

        .spacer-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .lefter-container {
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
        }

        .center-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .label {
          max-height: 80%;
          width: 20%;
          margin-left: 3%;
        }
        .color-tag {
          height: 20px;
          width: 20px;
        }
        .name-tag {
          height: 40%;
          width: 70%;
        }
        .controls {
          height: 100%;
          width: 100%;
          margin: auto 2% auto 20%;
        }

        .controls > paper-dropdown-menu-light {
          width: 50%;
        }

        .controls > paper-input {
          width: 30%;
        }

        #done {
          min-width: 20%;
          margin:0;
        }
        
        @media(min-width: 425px)
        {
          :host {
            --paper-dropdown-menu-input: {
              font-size: 18px;
              font-weight: bold;
              color: var(--calendar-header-forecolor);
              border-bottom: none;
            };

            --paper-input-container-input: {
              font-size: 18px;
              font-weight: bold;
              border-radius: 4px;
              color: var(--calendar-header-forecolor);
              border-bottom: none;
              padding: 2%;
            };
          }

          .header {
            height: 60px;
            padding-top: 5px;
            padding-bottom: 5px;
          }

          #previous,#next {
            min-width: 10%;
            margin:0;
          }

          .title {
            min-width: 80%;
            font-size: 24px;
          }

          .tag {
            font-size: 12px;
            height: 25px;
          }

        }

        @media(min-width: 768px)
        {
          .controls {
            height: 70%;
            margin: auto 10% auto 35%;
          }
        }
      </style>
      <iron-media-query query="(min-width: 768px)" query-matches="{{largeDevice}}"></iron-media-query>
      <div class="calendar">
        <div class="header">
          <template is="dom-if" if="[[displayCalendarSelection]]">
            <div class="controls spacer-container">
              <paper-dropdown-menu-light id="month-selector" noink no-animations vertical-offset="60">
                <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{selected_month}}">
                  <template is="dom-repeat" items="[[strfiedMonths]]" as="month">
                    <paper-item>[[month]]</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu-light>
              <paper-input type="number" value="{{selected_year}}" max="9999" no-label-float auto-validate pattern="[0-9]+"></paper-input>
              
            </div>
            <paper-button id="done" on-tap="_toggleCalendarSelection">
              <iron-icon icon="done"></iron-icon>
            </paper-button>
          </template>
          <template is="dom-if" if="[[!displayCalendarSelection]]">
            <paper-button id="previous" on-tap="_moveBackward">
              <iron-icon icon="chevron-left"></iron-icon>
            </paper-button>

            <div class="title center-container" on-tap="_toggleCalendarSelection">[[header_title]]</div>

            <paper-button id="next" on-tap="_moveForward">
              <iron-icon icon="chevron-right"></iron-icon>
            </paper-button>
          </template>

        </div>

        <div class="body">
          <div class="grid-container">
            <template is="dom-repeat" items="[[weekdays]]" as="weekday">
              <div class$="tag grid-item center-container[[defineWeekdayDisabled(index)]]">
                <template is="dom-if" if="[[largeDevice]]">[[weekday]]</template>
                <template is="dom-if" if="[[!largeDevice]]">[[weekdayAbbr(weekday)]]</template>
              </div>
            </template>
            <template is="dom-repeat" items="[[displayed_days]]" as="displayed_day">
              <day-item date="[[displayed_day.date]]"
                selected="[[displayed_day.isSelected]]"
                disabled="[[displayed_day.isDisabled]]"
                color="[[displayed_day.color]]"
                on-select="_selectDate"></day-item>
            </template>
          </div>
        </div>
        <template is="dom-if" if="[[ showIndicators ]]">
          <div class="labels-container bordered lefter-container">
            <template is="dom-repeat" items="[[evt_types_keys]]" as="evt">
              <div class="label spacer-container">
                <div class="color-tag bordered" style$="background-color: [[getEventColor(evt)]]"></div>
                <div class="name-tag">[[evt]]</div>
              </div>
            </template>
          </div>
        </template>
      </div>
    `;
  }
  
  getHeaderTitle(month, year) {
    return this.strfiedMonths[month] + ' '+ year;
  }

  getEventTypesKeys() {
    return Object.keys(this.evt_types);
  }

  getEventColor(key) {
    return this.evt_types[key].color;
  }

  getDisplayedDaysObj(month,year,cur_event) {
    let today = new Date();
    today.setHours(0,0,0,0);

    let firstDay = new Date(year, month, 1);
    let weekDay = firstDay.getDay();
    let _date = firstDay.DateAdd("d", -weekDay);
    let cur_evt_sel = this.evt_types[cur_event];

    let displayDaysArr = [];
    for(let i=0; i<35; i++) {
      let item = {
        date: _date.getTime(),
        isSelected: false,
        isDisabled: false,
        color: "",
      };

      let evt_in_date = this.evtLookUp(_date);

      if(evt_in_date)
        item.color = this.evt_types[evt_in_date].color;

      if( !this._readonly && (_date.getMonth() != month ||
      (_date.getTime() < this.parseDate(cur_evt_sel.min_date) || _date.getTime() > this.parseDate(cur_evt_sel.max_date))) ||
      (_date.getMonth() != month || (cur_evt_sel.restrictWeekdays && (_date.getDay() == 0 || _date.getDay() == 6))))
      {
        item.isDisabled = true;
      }

      if(item.color != "" && !item.isDisabled)
        item.isSelected = true;

      displayDaysArr = [...displayDaysArr, item];
      _date = _date.DateAdd("d", 1);
    }

    return displayDaysArr;
  }

  hasIndicators(evt_types) {
    return ( !evt_types[this.cur_event].hasOwnProperty("indicators") || evt_types[this.cur_event].indicators == 'true' );
  }

  _moveForward(eventArgs) {
    this.change_month("add");
  }
  
  _moveBackward(eventArgs) {
    this.change_month("substract");
  }

  _selectDate(eventArgs) {
    if(this._readonly)
      return;
    
    let _date = eventArgs.detail.date;

    let element = this.displayed_days.find((el) => { return el.date == _date; });
    //  Gets the index in the current event's array
    let evt_index = this.evt_types[this.cur_event]._dates.indexOf(_date);

    // Does nothing if the element is disabled, if it's selected but not for the current event or
    // if the whole component was put in calendar selection mode.
    if(element !== undefined && (element.isDisabled ||
    (element.selected && evt_index < 0) || this.displayCalendarSelection))
      return;

    if(evt_index >= 0) {  //  Delete selection of current date

      this.deselectEventDate(this.cur_event, _date);

    } else {  //  Add selection of current date
      var dates_per_event = new Object();
      this.evt_types_keys.forEach((key) => {
        dates_per_event[key] = this.evt_types[key]._dates;
      });
      if(!this.evt_types[this.cur_event].hasOwnProperty("validation") || this.evt_types[this.cur_event].validation === undefined ||
        ( this.evt_types[this.cur_event].hasOwnProperty("validation") && this.evt_types[this.cur_event].validation !== undefined &&
          this.evt_types[this.cur_event].validation(_date, dates_per_event) )
      ) {
        this.selectEventDate(this.cur_event, _date);
      }
    }
    
  }

  _toggleCalendarSelection(eventArgs) {
    this.displayCalendarSelection = !this.displayCalendarSelection;
  }

  isEmpty() {
    let keys = Object.keys(this.evt_types);
    let i = 0;
    let empty = true;
    while(i < keys.length && empty)
    {
      if(this.evt_types[keys[i]]._dates.length > 0){
        empty = false;
      }
      i++;
    }
    return empty;
  }

  getValues() {
    let values = {};
    this.evt_types_keys.forEach( (evt) => {
      values[evt] = this.evt_types[evt]._dates.map(datetime => new Date(datetime).toCustomFormat());
    });
    return values;
  }

  clearAll() {
    this.evt_types_keys.forEach( (evt) => this.clearEvt(evt) );
  }

  clearEvt(evt) {
    // Must throw an exception
    if(Object.keys(this.evt_types).indexOf(evt) < 0)
      return;

    while(this.evt_types[evt]._dates.length > 0) {
      let _date = this.evt_types[evt]._dates[0];
      this.deselectEventDate(evt, _date);
    }
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
  
  parseDate(str) {
    var _date;
    if(str == 'today')
      _date = new Date();
    else {
      _date = new Date(str); 
    }
    
    let value = null;
    if(_date != undefined)
      value = _date.getTime();

    return value;
  }

  displayMinDate() {
    let $evts = this.evt_types;
    //looks for the min date of the event types
    let _date = this.evt_types_keys.reduce( (min_date, evt) => {
      let _dates = $evts[evt]._dates;
      if(_dates.length == 0)
        return min_date;
      
      _dates.sort((a,b) => {
        return a < b? -1 : a > b? 1 : 0; 
      });

      if(_dates[0] <= min_date.getTime())
        return new Date(_dates[0]);
      else
        return min_date;
    }, new Date("12-31-9999"));

    if(_date.getTime() < new Date("12-31-9999").getTime()) {
      this.selected_month = _date.getMonth();
      this.selected_year = _date.getFullYear();
    }
  }

  changeEventDate(action, event, date) {
    let el_index = this.displayed_days.findIndex((e) => e.date === date);

    if(action == "attach") {
      this.dispatchEvent(new CustomEvent("before_date_attached", {detail:{which: date, evt: event}}));
      this.push("evt_types."+event+"._dates", date);
      if(el_index >= 0) {
        this.set("displayed_days."+el_index+".color", this.evt_types[event].color);
        this.set("displayed_days."+el_index+".isSelected", true);
      }

      this.dispatchEvent(new CustomEvent("date_attached", {detail:{which: date, evt: event}}));
    }
    else { //action == "detach"
      let evt_index = this.evt_types[event]._dates.indexOf(date);
      this.dispatchEvent(new CustomEvent("before_date_detached", {detail:{which: date, evt: event}}));
      this.splice("evt_types." + event + "._dates", evt_index, 1);

      if(el_index >= 0) {
        this.set("displayed_days."+el_index+".color", "");
        this.set("displayed_days."+el_index+".isSelected", false);
      }

      this.dispatchEvent(new CustomEvent("date_detached", {detail:{which: date, evt: event}}));
    }
  }

  selectEventDate(event, date) {
    
    this.dispatchEvent(new CustomEvent("before_date_attached", {detail:{which: date, evt: event}}));
      this.push("evt_types."+event+"._dates", date);
      
      this.setDateProperties(date, this.evt_types[event].color, true);

      this.dispatchEvent(new CustomEvent("date_attached", {detail:{which: date, evt: event}}));
  }

  deselectEventDate(event, date) {
    
    let evt_index = this.evt_types[event]._dates.indexOf(date);
      this.dispatchEvent(new CustomEvent("before_date_detached", {detail:{which: date, evt: event}}));
      this.splice("evt_types." + event + "._dates", evt_index, 1);

      this.setDateProperties(date, "", false);

      this.dispatchEvent(new CustomEvent("date_detached", {detail:{which: date, evt: event}}));
  }

  setDateProperties(date, color, isSelected) {
    let el_index = this.displayed_days.findIndex((e) => e.date === date);
      if(el_index >= 0) {
        this.set("displayed_days."+el_index+".color", color);
        this.set("displayed_days."+el_index+".isSelected", isSelected);
      }
  }

  /**
   * Given a date in calendar looks for the event attached if any
   */
  evtLookUp(_date) {
    let keys = Object.keys(this.evt_types);
    let value = undefined;
    let i = 0;
    while(value === undefined && i < keys.length)
    {
      let key = keys[i];
      if(this.evt_types[key]._dates.includes(_date.getTime())) {
        value = key;
      }
      i++;
    }
    return value;
  }
}

Object.defineProperty(Date.prototype, "toCustomFormat", {
  value: function toCustomFormat() {
    let year = this.getFullYear();
    let month = this.getMonth() + 1;
    let day = this.getDate();

    return year + '/' + ( month < 10? '0':'') + month + '/' + ( day < 10? '0':'') + day;
  },
  writable: true,
  configurable: true
});

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
