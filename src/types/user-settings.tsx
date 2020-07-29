export class UserSettings {
    private readonly _rememberSelectedDate: boolean;
    private readonly _neverSignIn: boolean;

    constructor(rememberSelectedDate: boolean, neverSignIn: boolean) {
        this._rememberSelectedDate = rememberSelectedDate;
        this._neverSignIn = neverSignIn;
    }

    get rememberSelectedDate(): boolean {
        return this._rememberSelectedDate;
    }

    get neverSignIn(): boolean {
        return this._neverSignIn;
    }
}