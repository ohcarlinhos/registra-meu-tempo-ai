export class FormatedFocus {
    Id: number;
    Title: string;
    RegisterDate: string;
    Duration: string;
    CategoryName: string;

    constructor(
        id: number,
        title: string,
        registerDate: string,
        durationInSeconds: number,
        categoryName: string = "-"
    ) {
        this.Id = id;
        this.Title = title;
        this.RegisterDate = new Date(registerDate).toLocaleString("pt-BR");
        this.Duration = this._secondsToString(durationInSeconds);
        this.CategoryName = categoryName;
    }

    private _secondsToString(secondsTotal: number) {
        let timeString = "";
        let secondsInitial = secondsTotal;

        let hours = Math.floor(secondsInitial / 3600);
        if (hours) {
            timeString += `${hours}h `;
            secondsInitial -= hours * 3600;
        }

        let minutes = Math.floor(secondsInitial / 60);
        if (minutes) {
            timeString += `${minutes}m `;
            secondsInitial -= minutes * 60;
        }

        let seconds = secondsInitial;
        if (seconds) timeString += `${seconds}s`;

        return timeString;
    }
}
