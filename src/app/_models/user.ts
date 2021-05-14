export class User {
  // tslint:disable-next-line:variable-name
  private _authId: string;
  // tslint:disable-next-line:variable-name
  private _id: string;

  constructor(authId: string, id: string) {
    this._authId = authId;
    this._id = id;
  }

  get authId(): string {
    return this._authId;
  }

  set authId(value: string) {
    this._authId = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }
}
