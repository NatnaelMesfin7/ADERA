import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const APP_PUBLIC_URL =
  process.env.APP_PUBLIC_URL?.trim() || "https://adera-finance.vercel.app/";

const BRAND_NAME = "ADERA Finance";
const EMAIL_SUBJECT = `${BRAND_NAME} Loan Health Warning`;

let resendClient: Resend | null = null;

const getResendClient = (): Resend => {
  if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }

  return resendClient;
};

const normalizeUrl = (url: string): string => {
  return url.endsWith("/") ? url : `${url}/`;
};

export const sendWarningEmail = async (
  principal: bigint,
  borrowAsset: string,
  email: string,
  loanId: string,
  healthFactor: number,
): Promise<void> => {
  if (!RESEND_FROM_EMAIL) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable.");
  }

  const resend = getResendClient();
  const formattedHealthFactor = healthFactor.toFixed(4);
  const principalFormatted = (Number(principal) / 1e18).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
  const appUrl = normalizeUrl(APP_PUBLIC_URL);

  const textBody = [
    EMAIL_SUBJECT,
    "",
    `Your ${BRAND_NAME} loan health factor has entered a risky range.`,
    "",
    `Loan ID: ${loanId}`,
    `Borrow Asset: ${borrowAsset}`,
    `Principal: ${principalFormatted}`,
    `Current health factor: ${formattedHealthFactor}`,
    "",
    "If the health factor drops below 1.00, your loan can be liquidated.",
    "Please review your position and consider adding collateral or repaying part of the loan.",
    "",
    `Open ADERA Finance: ${appUrl}`,
  ].join("\n");

  const htmlBody = `
    <div style="margin:0;padding:32px 16px;background-color:#f4faff;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        Your ${BRAND_NAME} loan health factor needs attention.
      </div>
      <div style="max-width:640px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#0f2138;">
        <div style="background:linear-gradient(135deg,#dff1ff 0%,#f8fcff 100%);border:1px solid #cfe7ff;border-radius:24px;padding:24px 24px 18px 24px;box-shadow:0 18px 42px rgba(47,135,242,0.12);">
          <div style="display:inline-block;padding:7px 12px;border-radius:999px;background-color:#eaf6ff;border:1px solid #b7dbff;color:#2f87f2;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
            Loan Risk Alert
          </div>
          <h1 style="margin:18px 0 6px 0;font-size:28px;line-height:1.15;font-weight:700;color:#0f2138;">
            ${BRAND_NAME}
          </h1>
          <p style="margin:0;font-size:16px;line-height:1.6;color:#526987;">
            Your loan health factor has entered a risky range and may need action soon.
          </p>

          <div style="margin-top:24px;background-color:#ffffff;border:1px solid #d7ebff;border-radius:20px;padding:20px;">
            <div style="padding:0 0 14px 0;border-bottom:1px solid #e6f2ff;">
              <p style="margin:0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6b84a6;">
                Current Health Factor
              </p>
              <p style="margin:10px 0 0 0;font-size:34px;line-height:1;font-weight:700;color:#2f87f2;">
                ${formattedHealthFactor}
              </p>
            </div>

            <div style="margin-top:14px;">
              <div style="padding:10px 0;border-bottom:1px solid #eef6ff;">
                <span style="display:block;font-size:13px;color:#6b84a6;">Loan ID</span>
                <span style="display:block;margin-top:4px;font-size:15px;font-weight:600;color:#0f2138;">${loanId}</span>
              </div>
              <div style="padding:10px 0;border-bottom:1px solid #eef6ff;">
                <span style="display:block;font-size:13px;color:#6b84a6;">Borrow Asset</span>
                <span style="display:block;margin-top:4px;font-size:15px;font-weight:600;color:#0f2138;">${borrowAsset}</span>
              </div>
              <div style="padding:10px 0;">
                <span style="display:block;font-size:13px;color:#6b84a6;">Principal</span>
                <span style="display:block;margin-top:4px;font-size:15px;font-weight:600;color:#0f2138;">${principalFormatted}</span>
              </div>
            </div>
          </div>

          <div style="margin-top:22px;padding:16px 18px;background-color:#eef7ff;border:1px solid #cfe7ff;border-radius:18px;">
            <p style="margin:0;font-size:14px;line-height:1.7;color:#35506f;">
              If the health factor drops below <strong>1.00</strong>, your loan can be liquidated.
              Review your position and consider adding collateral or repaying part of the loan.
            </p>
          </div>

          <div style="margin-top:24px;">
            <a href="${appUrl}" style="display:inline-block;padding:13px 18px;border-radius:14px;background:linear-gradient(135deg,#6ac2ff,#3b82f6);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
              Open ${BRAND_NAME}
            </a>
          </div>

          <p style="margin:22px 0 0 0;font-size:13px;line-height:1.7;color:#6b84a6;">
            You are receiving this alert because notification monitoring is enabled for this loan.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: `${BRAND_NAME} <${RESEND_FROM_EMAIL}>`,
      to: email,
      subject: EMAIL_SUBJECT,
      text: textBody,
      html: htmlBody,
    });

    console.log("email sent from resend");
  } catch (err) {
    console.error("failed to send email via Resend:", err);
    throw err;
  }
};
