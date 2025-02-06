export class Result<T, E = Error> {
  private constructor(
    private success: boolean,
    private value?: T | Promise<T>,
    private error?: E
  ) {
    if (value instanceof Promise) {
      value
        .then(resolvedValue => {
          this.value = resolvedValue;
          if (this.successCallback) {
            this.successCallback(resolvedValue);
          }
        })
        .catch(error => {
          this.success = false;
          this.error = error as E;
          if (this.failureCallback) {
            this.failureCallback(this.error);
          }
        })
        .finally(() => {
          if (this.finallyCallback) {
            this.finallyCallback();
          }
        });
    }
  }

  private successCallback?: (data: T) => void;
  private failureCallback?: (error: E) => void;
  private finallyCallback?: () => void;

  static success<T>(data: T | Promise<T>): Result<T> {
    return new Result(true, data);
  }

  static failure<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }

  onSuccess(callback: (data: T) => void): Result<T, E> {
    if (this.success) {
      if (this.value instanceof Promise) {
        this.successCallback = callback;
      } else if (this.value !== undefined) {
        callback(this.value);
      }
    }
    return this;
  }

  onFailure(callback: (error: E) => void): Result<T, E> {
    if (!this.success && this.error !== undefined) {
      callback(this.error);
    } else if (this.value instanceof Promise) {
      this.failureCallback = callback;
    }
    return this;
  }

  finally(callback: () => void): Result<T, E> {
    if (this.value instanceof Promise) {
      this.finallyCallback = callback;
    } else {
      callback();
    }
    return this;
  }
}

export default Result;
