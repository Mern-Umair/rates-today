import type { Metadata } from "next";
import { TextPage } from "@/components/TextPage";
import { adsenseClient, owner, siteName } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Privacy policy",
  description: `What ${siteName} does and does not collect. No accounts, no forms; only the usual technical details any website receives, and advertising cookies if ads are shown.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy policy" updated="20 October 2026">
      <p>
        This policy explains what happens to your information when you use {siteName}. The short version: the site has
        nothing to collect from you. There are no accounts, no sign-ups and no forms.
      </p>

      <h2>Information we do not ask for</h2>
      <p>
        We do not ask for your name, phone number, email address, CNIC number or bank details. The converter on each
        page works inside your browser; the amounts you type are not sent anywhere.
      </p>

      <h2>Technical information</h2>
      <p>
        Like every website, the company that hosts {siteName} receives basic technical details when a page is requested,
        such as the IP address, the type of browser and the time of the request. These are used to deliver the pages and
        keep the service secure.
      </p>

      <h2>Cookies and advertising</h2>
      {adsenseClient ? (
        <>
          <p>
            {siteName} is free to use and is paid for by advertising from Google AdSense. Third party vendors, including
            Google, use cookies to serve ads based on your earlier visits to this and other websites. Google’s use of
            advertising cookies lets it and its partners show you ads based on those visits.
          </p>
          <p>
            You can turn off personalised advertising in Google’s{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Ads Settings
            </a>
            , or opt out of some other vendors’ personalised ads at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            . Visitors in the European Economic Area and the UK are asked for consent before advertising cookies are
            set.
          </p>
        </>
      ) : (
        <p>
          We may add advertising from Google AdSense in future to pay for the site. If we do, third party vendors,
          including Google, would use cookies to serve ads based on your earlier visits, and this policy will say so.
        </p>
      )}

      <h2>Links to other sites</h2>
      <p>
        Pages link to the State Bank of Pakistan, OGRA and other publishers so you can check a figure at its source.
        Those sites have their own privacy policies.
      </p>

      <h2>Changes and contact</h2>
      <p>
        If this policy changes, the date at the top changes with it. Questions go to {owner.name} at {owner.email}.
      </p>
    </TextPage>
  );
}
