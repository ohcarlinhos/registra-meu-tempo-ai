export type FocusType = {
    Id: number;
    Title: string;
    RegisterDate: string;
    Duration: {
        Exact: {
            Hours: number;
            Minutes: number;
            Seconds: number;
        };
        InSeconds: number;
    };
    CategoryName: string;
};
