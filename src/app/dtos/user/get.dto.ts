export class GetDTO {
    page?: number;
    pageSize?: number;
    SearchByName?: string;
    SearchByPhoneNumber?: string;
    SearchByEmail?: string;
    sortBy?: string;
    sortOrder?: string;
    role?: string;
    id?: string;

    constructor(data: any) {
        this.page = data.page;
        this.pageSize = data.pageSize;
        this.SearchByName = data.SearchByName;
        this.SearchByPhoneNumber = data.SearchByPhoneNumber;
        this.sortBy = data.sortBy;
        this.sortOrder = data.sortOrder;
        this.role = data.role;
        this.id = data.id;
    }

    cleanParams() {
        return Object.fromEntries(
            Object.entries(this).filter(([_, value]) => value !== undefined)
        ) as GetDTO;
    }
}