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
        this.RegisterDate = registerDate;
        this.Duration = `${durationInSeconds}`;
        this.CategoryName = categoryName;
    }
}
