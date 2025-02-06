class Result<T, E = Error> {
  private readonly value: T | null;
  private readonly error: E | null;
  private isHandled: boolean = false;

  private constructor(value: T | null, error: E | null) {
    this.value = value;
    this.error = error;
  }

  static fromAsync<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
    return new Promise<Result<T, E>>(resolve => {
      promise
        .then(value => resolve(Result.success(value)))
        .catch(error => resolve(Result.failure(error)));
    });
  }

  static success<T, E = Error>(value: T): Result<T, E> {
    return new Result(value, null as unknown as E);
  }

  static failure<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(null as unknown as T, error);
  }

  onSuccess(callback: (value: T) => void): Result<T, E> {
    if (this.value !== null) {
      callback(this.value);
      this.isHandled = true;
    }
    return this;
  }

  onFailure(callback: (error: E) => void): Result<T, E> {
    if (this.error !== null) {
      callback(this.error);
      this.isHandled = true;
    }
    return this;
  }

  // Optional: Add a finally method that runs regardless of success/failure
  finally(callback: () => void): Result<T, E> {
    callback();
    return this;
  }

  // Optional: Method to check if the result was handled
  wasHandled(): boolean {
    return this.isHandled;
  }
}

export default Result;
