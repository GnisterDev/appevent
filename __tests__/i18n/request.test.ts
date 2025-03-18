import { cookies } from "next/headers";
import configFn from "@/i18n/request";

jest.mock("next-intl/server", () => ({
  getRequestConfig: jest.fn(fn => fn),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock(
  "messages/no.json",
  () => ({
    hello: "Hei verden",
  }),
  { virtual: true }
);

jest.mock(
  "messages/en.json",
  () => ({
    hello: "Hello world",
  }),
  { virtual: true }
);
jest.mock(
  "messages/fr.json",
  () => {
    throw new Error("Module not found");
  },
  { virtual: true }
);

describe("Internationalization configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should use 'no' locale by default when no cookie is present", async () => {
    const mockGet = jest.fn().mockReturnValue(undefined);
    const mockCookies = Promise.resolve({
      get: mockGet,
    });

    (cookies as jest.Mock).mockReturnValue(mockCookies);

    const config = await configFn();
    expect(config.locale).toBe("no");
    expect(config.messages).toEqual({
      hello: "Hei verden",
    });
    expect(mockGet).toHaveBeenCalledWith("locale");
  });

  it("should use locale from cookie when available", async () => {
    const mockGet = jest.fn().mockReturnValue({
      value: "en",
    });
    const mockCookies = Promise.resolve({
      get: mockGet,
    });

    (cookies as jest.Mock).mockReturnValue(mockCookies);

    const config = await configFn();
    expect(config.locale).toBe("en");
    expect(config.messages).toEqual({
      hello: "Hello world",
    });
    expect(mockGet).toHaveBeenCalledWith("locale");
  });

  it("should handle promise resolution properly from cookies", async () => {
    const mockGet = jest.fn().mockReturnValue({
      value: "en",
    });
    const mockCookies = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          get: mockGet,
        });
      }, 10);
    });

    (cookies as jest.Mock).mockReturnValue(mockCookies);

    const config = await configFn();
    expect(config.locale).toBe("en");
    expect(mockGet).toHaveBeenCalledWith("locale");
  });

  it("should handle errors when loading messages", async () => {
    const mockGet = jest.fn().mockReturnValue({
      value: "fr",
    });
    const mockCookies = Promise.resolve({
      get: mockGet,
    });

    (cookies as jest.Mock).mockReturnValue(mockCookies);
    await expect(configFn()).rejects.toThrow();
  });
});
