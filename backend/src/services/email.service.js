import { MailtrapClient } from "mailtrap";

const getClient = () => {
  const token = process.env.MAILTRAP_TOKEN;
  if (!token) return null;

  return new MailtrapClient({
    token,
    sandbox: process.env.MAILTRAP_USE_SANDBOX === "true",
    testInboxId: process.env.MAILTRAP_INBOX_ID ? Number(process.env.MAILTRAP_INBOX_ID) : undefined,
  });
};

const getSender = () => ({
  name: process.env.MAILTRAP_FROM_NAME || "Pro Manager",
  email: process.env.MAILTRAP_FROM_EMAIL || "info@gbma.tech",
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const client = getClient();
  if (!client) {
    console.warn("MAILTRAP_TOKEN is not configured; skipping email send.");
    return { skipped: true };
  }

  const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({ email }));
  return client.send({
    from: getSender(),
    to: recipients,
    subject,
    text,
    html,
  });
};

export const sendBranchAdminWelcomeEmail = async ({
  email,
  name,
  branchName,
  branchCode,
  temporaryPassword,
}) => {
  const loginUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const subject = `Your ${branchName} branch admin account`;
  const text = [
    `Hello ${name},`,
    "",
    `A branch admin account has been created for "${branchName}" (${branchCode}).`,
    "",
    "Login credentials:",
    `Email: ${email}`,
    `Temporary password: ${temporaryPassword}`,
    "",
    `Sign in at: ${loginUrl}`,
    "",
    "Please change your password after your first login.",
  ].join("\n");

  const html = `
    <p>Hello ${name},</p>
    <p>A branch admin account has been created for <strong>${branchName}</strong> (<code>${branchCode}</code>).</p>
    <p><strong>Login credentials</strong></p>
    <ul>
      <li>Email: <strong>${email}</strong></li>
      <li>Temporary password: <strong>${temporaryPassword}</strong></li>
    </ul>
    <p><a href="${loginUrl}">Sign in to Pro Manager</a></p>
    <p>Please change your password after your first login.</p>
  `;

  return sendEmail({ to: email, subject, text, html });
};

export const sendAssetQrEmail = async ({
  to,
  name,
  assetName,
  assetCode,
  qrAttachment,
}) => {
  const subject = `Asset QR label - ${assetCode}`;
  const text = [
    `Hello ${name},`,
    "",
    `Attached is the QR code label for ${assetName} (${assetCode}).`,
    "Print and affix it to the asset, or scan it with the asset management scanner.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Asset QR label</h2>
      <p>Hello ${name},</p>
      <p>Attached is the QR code label for <strong>${assetName}</strong> (<code>${assetCode}</code>).</p>
      <p>Print and affix it to the asset, or scan it with the asset management scanner.</p>
      <img src="cid:asset-qr-label" alt="${assetCode}" width="180" height="180" />
    </div>
  `;

  const client = getClient();
  if (!client) {
    console.warn("MAILTRAP_TOKEN is not configured; skipping asset QR email send.");
    return { skipped: true };
  }

  return client.send({
    from: getSender(),
    to: [{ email: to }],
    subject,
    text,
    html,
    attachments: qrAttachment
      ? [
          {
            filename: qrAttachment.filename,
            content: qrAttachment.content,
            disposition: "inline",
            content_id: "asset-qr-label",
          },
        ]
      : [],
    category: "asset-qr",
  });
};
