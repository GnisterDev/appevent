import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "messages/no.json";

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
