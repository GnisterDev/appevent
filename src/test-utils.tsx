import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import messagesImport from "messages/no.json";

// Type assertion to tell TypeScript that the messages structure is compatible
const messages = messagesImport as unknown as AbstractIntlMessages;

const customRender = (
  ui: React.ReactElement,
  { locale = "en", messages: customMessages = messages, ...options } = {}
) => {
  return rtlRender(
    <NextIntlClientProvider locale={locale} messages={customMessages}>
      {ui}
    </NextIntlClientProvider>,
    options
  );
};

export * from "@testing-library/react";
export { customRender as render };
