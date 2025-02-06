class AuthResult<E = Error> {
  private successCallback?: () => void;
  private failureCallback?: (error: E) => void;
  private finallyCallback?: () => void;

  constructor(promise: Promise<void>) {
    promise
      .then(() => this.successCallback && this.successCallback())
      .catch(error => this.failureCallback && this.failureCallback(error))
      .finally(() => this.finallyCallback && this.finallyCallback());
  }

  public onSuccess(callback: () => void): AuthResult<E> {
    this.successCallback = callback;
    return this;
  }

  public onFailure(callback: (error: E) => void): AuthResult<E> {
    this.failureCallback = callback;
    return this;
  }

  public finally(callback: () => void): AuthResult<E> {
    this.finallyCallback = callback;
    return this;
  }
}

export default AuthResult;
