export class GeneralClientError extends Error {
  protected customErrorMessages: string[] | null;
  constructor(message: string="General Client Error", customErrorMessages?: string[]) {
    super(message);
    this.customErrorMessages = customErrorMessages ? customErrorMessages : null;
  }

  public get errorMessages(): string[] {
    return this.customErrorMessages;
  }

  protected setErrorMessages(errorMessages?: string[]) {
    if (errorMessages) {
      this.customErrorMessages = errorMessages;
    } else {
      this.customErrorMessages = [ "General client error occured. Please try again" ]
    }
  }
};

export class ClientInputError extends GeneralClientError {
  constructor(message: string="Client Input Error", customErrorMessages?: string[]) {
    super(message, customErrorMessages);
    this.init(customErrorMessages)
  }

  private init(customErrorMessages?: string[]) {
    if (customErrorMessages) {
      this.customErrorMessages = customErrorMessages;
    } else {
      this.customErrorMessages = [ "Invalid client input. Please try again." ];
    }
  }
};

export class ClientAuthError extends GeneralClientError {
  constructor(message: string="Client Auth Error", customErrorMessages?: string[]) {
    super(message, customErrorMessages);
    this.init(customErrorMessages)
  }

  private init(customErrorMessages?: string[]) {
    if (customErrorMessages) {
      this.customErrorMessages = customErrorMessages;
    } else {
      this.customErrorMessages = [ "Authorization error. Please try to login again." ];
    }
  }
}