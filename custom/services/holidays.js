

export class Holidays {
    holidaysArr = [
        {
            name: 'Año Nuevo',
            month: 1, //jan
            day: 1,
            longWeekend: false,
            icon: 'assets/images/new_yr_icon.png'
        },
        {
            name: 'Día de la Constitución Mexicana',
            month: 2, //feb
            day: 5,
            longWeekend: true
        },
        {
            name: 'Natalicio de Benito Juárez',
            month: 3, //Mar
            day: 21,
            longWeekend: true
        },
        {
            name: 'Día del Trabajo',
            month: 5, //Mar
            day: 1,
            longWeekend: false
        },
        {
            name: 'Día de la Independecia',
            month: 9, //Mar
            day: 16,
            longWeekend: false
        },
        {
            name: 'Día de la Revolución Mexicana',
            month: 11, //Mar
            day: 20,
            longWeekend: true
        },
        {
            name: 'Navidad',
            month: 12, //dec
            day: 25,
            longWeekend: false,
            icon: 'assets/images/christmas_icon.png'
        }
    ];

    monthsNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    constructor() {
    }

    static Instance = new Holidays();

    getHolidaysByMonth(month, year) {
        return this.holidaysArr.filter( holiday => holiday.month - 1 === month ).map( function(holiday) {

            let _date = new Date(holiday.month + "/" + holiday.day + "/" + year);
            _date.setHours(0,0,0,0);
            if(holiday.longWeekend) {
                let daysToMonday =  1 - (_date.getDay());
                _date = _date.DateAdd("d", daysToMonday);
            }
            holiday.icon = (holiday.hasOwnProperty('icon')? holiday.icon : 'assets/images/mx_coat_of_arms_icon.png');
            holiday.celebOn = _date.toCustomFormat();
            holiday.note = "(" + this.getOrdinal(holiday.day) + " de " + this.monthsNames[holiday.month-1] + ") "+ holiday.name + ".";
            return holiday;
        }.bind(this));
    }

    getHolidayByDate(datetime) {
        let date = new Date(datetime);
        let month = date.getMonth();
        let year = date.getFullYear();
        let monthHolidays = this.getHolidaysByMonth(month, year);
        if(monthHolidays.length == 0)
            return undefined;
        return monthHolidays.find(hd => hd.celebOn === date.toCustomFormat());
    }

    getOrdinal(number) {
        if(number == 1)
            return "1ero.";
        if(number == 2)
            return "2do.";
        if(number == 3)
            return "3ero.";
        return number.toString();
    }
}