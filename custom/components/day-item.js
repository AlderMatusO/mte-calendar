import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { Holidays } from '../services/holidays.js';
import { christmasCSS } from '../../assets/icons/christmas_icon.js';
import { mx_coatCSS } from '../../assets/icons/mx_coat_icon.js';
import { new_yrCSS } from '../../assets/icons/new_yr_icon.js';

class DayItem extends PolymerElement {
    
    static get properties() {
        return {
            //@Input()
            date: {
                type: Number,
                value() {
                    return 0;
                },
                observer: '_dateChanged'
            },
            //@Input()
            selected: {
                type: Boolean,
                observer: '_selectedChanged'
            },
            //@Input()
            disabled: {
                type:Boolean,
                observer: '_disabledChanged'
            },
            //@Input()
            color: String,
            classes: {
                type: String,
                computed: 'getClasses(element.classArr)'
            },
            holiday: {
                type: Object
            },
            element: Object,
            hdService: {
                type: Holidays
            }
        }
    }

    constructor() {
        super();
        this.selected = false;
        this.disabled = false;
        this.color = "";
        this.element = { };
        this.hdService = Holidays.Instance;
    }

    ready() {
        this.defineElement(this.date);
        super.ready();
    }

    static get template() {
        return html `
            <style>
                
                .day {
                    position: relative;
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

                .holiday > .day-tag {
                    color: transparent;
                }

                ${ christmasCSS }
                
                ${ mx_coatCSS }

                ${ new_yrCSS }
                
                .holiday .tooltip::after {
                    content: "";
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: transparent transparent black transparent;
                }

                .holiday .tooltip {
                    font-size: 10px;
                    visibility: hidden;
                    width: 120px;
                    background-color: black;
                    color: #fff;
                    text-align: center;
                    padding: 5px 0;
                    border-radius: 6px;

                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -60px;
                    z-index: 1;
                }

                .holiday:hover .tooltip {
                    visibility: visible;
                }

                #today > .day-tag {
                    width: 90%;
                    border-style: solid;
                    border-width: 2px;
                    border-color: var(--calendar-header-bkgnd);
                }
        
                .selected {
                    color: white;
                }

                .center-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @media(min-width: 425px)
                {
                    .day {
                        font-size: 20px;
                        height: 50px;
                    }
                }
            </style>
            <div id="[[element.id]]" class$="[[classes]]"
                style$="[[element.style]]" on-tap="_selectDate" aria-label$="[[date]]">
                
                <div class="day-tag center-container">[[element.number]]</div>
                <template is="dom-if" if="[[ holiday ]]">
                    <span class="tooltip">{{ holiday.note }}</span>
                </template>
            </div>`;
    }
    
    _dateChanged() {
        this.defineElement();
    }
    
    _selectedChanged() {
        this.set("element.classArr", this.getElementClassArr());
        this.set("element.style", this.getElementStyle());
    }

    _disabledChanged() {
        this.set("element.classArr", this.getElementClassArr());
        this.set("element.style", this.getElementStyle());
    }

    defineElement() {
        let today = new Date();
        today.setHours(0,0,0,0);
        let date = new Date(this.date);
        this.holiday = this.hdService.getHolidayByDate(this.date);
        if(this.holiday) {
            this.disabled = true;
        }
        
        this.element = {
            id: (today.getTime() === this.date? "today" : ""),
            number: date.getDate(),
            classArr: this.getElementClassArr(),
            style: this.getElementStyle()
        }
    }
    
    getElementClassArr() {
        let classArr = ['day', 'grid-item', 'center-container'];
        if(this.disabled)
            classArr = [...classArr, 'disabled'];
        if(this.selected)
            classArr = [...classArr, 'selected'];
        if(this.holiday){
            classArr = [...classArr, 'holiday'];
            classArr = [...classArr, this.holiday.icon];
        }

        return classArr;
    }

    getClasses(classArr) {
        return classArr.join(" ");
    }

    getElementStyle() {
        
        let style = this.color !== ""? "background-color: " + this.color + ";" : "";

        if(this.color !== "" && this.disabled) {
            style += " opacity: 0.6;";
        }

        return style;
    }

    _selectDate(evt) {
        if(this.disabled)
            return;
        this.dispatchEvent(new CustomEvent('select', {detail: {date: this.date}}));
    }

}

window.customElements.define('day-item', DayItem);