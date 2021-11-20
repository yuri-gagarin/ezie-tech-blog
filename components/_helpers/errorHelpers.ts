export class GeneralClientError extends Error {
  protected customErrorMessages: string[] | null;
  constructor(message?: string, customErrorMessages?: string[]) {
    super(message = "Client error occured");
    this.customErrorMessages = customErrorMessages ? customErrorMessages : null;
  }

  protected getErrorMessages(): string[] | null {
    return this.customErrorMessages;
  }

  protected setErrorMessages(errorMessages?: string[]) {
    if (errorMessages) {

    } else {
      this.customErrorMessages = [ "General client error occured. Please try again" ]
    }
  }
};

export class ClientInputError extends GeneralClientError {
  constructor({ message, customErrorMessages }: { message?: string; customErrorMessages?: string[]; }) {
    super(message, customErrorMessages);
    this.init(customErrorMessages)
  }

  private init(customErrorMessages?: string[]) {
    if (customErrorMessages) {
      this.customErrorMessages = customErrorMessages;
    } else {
      this.customErrorMessages = [ "Invalid client input" ];
    }
  }
};

export class ClientAuthError extends GeneralClientError {
  constructor({ message, customErrorMessages }: { message?: string; customErrorMessages?: string[]; }) {
    super(message, customErrorMessages);
    this.init(customErrorMessages)
  }

  private init(customErrorMessages?: string[]) {
    if (customErrorMessages) {
      this.customErrorMessages = customErrorMessages;
    } else {
      this.customErrorMessages = [ "Invalid client input" ];
    }
  }
}