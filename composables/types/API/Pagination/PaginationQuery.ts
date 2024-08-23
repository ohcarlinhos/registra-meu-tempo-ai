export interface IPaginationQuery {
  page: number;
  perPage: number;
  search: string;
}

export class PaginationQuery implements IPaginationQuery {
  private _page: number = 1;
  private _perPage: number = 10;
  private _search: string = "";

  public get page(): number {
    return this._page;
  }

  public set page(value: number | undefined | string) {
    if (typeof value === "string") value = parseInt(value);
    if (!value || value < 1) this._page = 1;
    else this._page = value;
  }

  public get perPage(): number {
    return this._perPage;
  }

  public set perPage(value: number | undefined | string) {
    if (typeof value === "string") value = parseInt(value);
    if (!value || value < 1) this._perPage = 10;
    else this._perPage = value;
  }

  public get search(): string {
    return this._search;
  }

  public set search(value: string | null | undefined) {
    if (!value) this._search = "";
    else this._search = value;
  }
}
