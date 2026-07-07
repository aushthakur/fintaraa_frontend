export const WEBSITE_PLATFORM = "website";

export const WHATSAPP_CONSENT_TEXT =
  "I agree that Fintaraa may contact me on WhatsApp, call, SMS, or email for my request, application updates, document support, and service communication.";

export const buildWebsiteSourcePayload = (formSource: string) => ({
  source: WEBSITE_PLATFORM,
  platform: WEBSITE_PLATFORM,
  sourcePlatform: WEBSITE_PLATFORM,
  formSource,
});

export const buildWebsiteConsentPayload = (formSource: string) => {
  const source = buildWebsiteSourcePayload(formSource);

  return {
    ...source,
    whatsappConsent: true,
    communicationConsent: {
      whatsapp: true,
      call: true,
      sms: true,
      email: true,
      consentText: WHATSAPP_CONSENT_TEXT,
      consentedAt: new Date().toISOString(),
      ...source,
    },
  };
};
