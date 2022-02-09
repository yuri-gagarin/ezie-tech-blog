export class GeneralServerError extends Error {
  protected customErrorMessages: string[];
  constructor(message: string="General Server Error", customErrorMessages?: string[]) {
    super(message);
    this.customErrorMessages = customErrorMessages || [ "A server error occured" ];
    Object.setPrototypeOf(this, GeneralServerError.prototype);
  }

  public get getErrorMessages(): string[] {
    return this.customErrorMessages;
  }
};

export class AuthNotFoundError extends GeneralServerError {
  constructor(message: string = "Auth Not Found Error", customMessages?: string[]) {
    super(message, customMessages || ["Queried user was not found" ]);
    Object.setPrototypeOf(this, AuthNotFoundError.prototype);
  }
};

