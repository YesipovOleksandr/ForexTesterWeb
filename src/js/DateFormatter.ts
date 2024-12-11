export class DateFormatter {
    private dateFormat: Intl.DateTimeFormat;

    constructor(locale: string = 'en-GB') {
        this.dateFormat = new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: 'short',  
            year: 'numeric', 
        });
    }

    format(date: number): string {
        const jsDate = new Date(date * 1000); 
        return this.dateFormat.format(jsDate);
    }
}