import { MailtrapClient } from 'mailtrap';

let cachedClient;

function getClient() {
  const token = process.env.MAILTRAP_TOKEN?.trim();
  if (!token) return null;

  if (cachedClient) return cachedClient;

  const sandbox = process.env.MAILTRAP_USE_SANDBOX === 'true';
  const inboxId = process.env.MAILTRAP_INBOX_ID
    ? Number(process.env.MAILTRAP_INBOX_ID)
    : undefined;

  cachedClient = new MailtrapClient({
    token,
    sandbox,
    testInboxId: sandbox ? inboxId : undefined,
  });

  return cachedClient;
}

function getFromAddress() {
  const email = process.env.MAILTRAP_FROM_EMAIL?.trim();
  const name = process.env.MAILTRAP_FROM_NAME?.trim() || 'ProManager';
  if (!email) return null;
  return { email, name };
}

export function isMailConfigured() {
  return Boolean(getClient() && getFromAddress());
}

export function getMailConfigStatus() {
  if (!process.env.MAILTRAP_TOKEN?.trim()) {
    return { configured: false, reason: 'MAILTRAP_TOKEN is missing' };
  }
  if (!process.env.MAILTRAP_FROM_EMAIL?.trim()) {
    return { configured: false, reason: 'MAILTRAP_FROM_EMAIL is missing' };
  }
  return { configured: true, reason: null };
}

export async function sendMail({ to, subject, html, text }) {
  const mailtrap = getClient();
  const from = getFromAddress();

  if (!mailtrap || !from) {
    const reason = !process.env.MAILTRAP_TOKEN?.trim()
      ? 'MAILTRAP_TOKEN is missing'
      : 'MAILTRAP_FROM_EMAIL is missing';
    console.log('[mailer] Mailtrap not configured — email not sent:', { to, subject, reason });
    return { sent: false, simulated: true, reason };
  }

  const result = await mailtrap.send({
    from,
    to: [{ email: to }],
    subject,
    html,
    text,
  });

  return { sent: true, messageId: result.message_ids?.[0] };
}

function getFrontendUrl() {
  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
}

function buildPaymentUrl({ serviceId, registrationId, organizationName }) {
  const params = new URLSearchParams();
  if (serviceId) params.set('service', serviceId);
  if (registrationId) params.set('registration', registrationId);
  if (organizationName) params.set('org', organizationName);
  return `${getFrontendUrl()}/process-payment?${params.toString()}`;
}

function emailShell({ title, greeting, bodyHtml, bodyText, paymentUrl }) {
  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
      <h2 style="color: #2563eb; margin-bottom: 8px;">${title}</h2>
      <p>Hello ${greeting},</p>
      ${bodyHtml}
      <p style="margin: 28px 0;">
        <a href="${paymentUrl}" style="background: #2563eb; color: #fff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Proceed to payment</a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">If you did not expect this email, you can safely ignore it.</p>
      <p style="color: #6b7280; font-size: 14px;">— The ProManager Team</p>
    </div>
  `;

  const text = `Hello ${greeting},\n\n${bodyText}\n\nProceed to payment: ${paymentUrl}\n\n— The ProManager Team`;

  return { html, text };
}

export function buildRegistrantIsManagerEmail({
  registrantName,
  serviceTitle,
  organizationName,
  serviceId,
  registrationId,
}) {
  const paymentUrl = buildPaymentUrl({ serviceId, registrationId, organizationName });
  const bodyHtml = `
    <p>Thank you for registering <strong>${organizationName}</strong> for <strong>${serviceTitle}</strong> on ProManager.</p>
    <p>You are now the <strong>administrator</strong> of <strong>${organizationName}</strong>. Your workspace will be activated once payment is confirmed.</p>
    <p style="color: #6b7280; font-size: 14px;">Use the button below to view pricing and complete your payment.</p>
  `;
  const bodyText = `Thank you for registering ${organizationName} for ${serviceTitle}.\n\nYou are now the administrator of ${organizationName}. Your workspace will be activated once payment is confirmed.`;

  const { html, text } = emailShell({
    title: 'Thank you for registering',
    greeting: registrantName,
    bodyHtml,
    bodyText,
    paymentUrl,
  });

  return {
    subject: `Welcome — you are the administrator of ${organizationName}`,
    html,
    text,
  };
}

export function buildRegistrantNotManagerEmail({
  registrantName,
  serviceTitle,
  organizationName,
  managerName,
  serviceId,
  registrationId,
}) {
  const paymentUrl = buildPaymentUrl({ serviceId, registrationId, organizationName });
  const bodyHtml = `
    <p>Thank you for registering <strong>${organizationName}</strong> for <strong>${serviceTitle}</strong> on ProManager.</p>
    <p>The administrator of <strong>${organizationName}</strong> is <strong>${managerName}</strong>. They will manage the workspace once payment is confirmed.</p>
    <p style="color: #6b7280; font-size: 14px;">You can view pricing and payment details using the button below.</p>
  `;
  const bodyText = `Thank you for registering ${organizationName} for ${serviceTitle}.\n\nThe administrator of ${organizationName} is ${managerName}.`;

  const { html, text } = emailShell({
    title: 'Thank you for registering',
    greeting: registrantName,
    bodyHtml,
    bodyText,
    paymentUrl,
  });

  return {
    subject: `Thank you for registering ${organizationName}`,
    html,
    text,
  };
}

export function buildManagerAdminEmail({
  managerName,
  serviceTitle,
  organizationName,
  registrantName,
  serviceId,
  registrationId,
  temporaryPassword,
  pendingReview,
}) {
  const paymentUrl = buildPaymentUrl({ serviceId, registrationId, organizationName });
  const credentialsBlock = temporaryPassword
    ? `<p>Your temporary sign-in password is: <strong style="font-family: monospace;">${temporaryPassword}</strong></p><p style="color: #6b7280; font-size: 14px;">Please change it after your first sign-in.</p>`
  : pendingReview
    ? `<p style="color: #6b7280;">Your workspace is pending review. It will be activated once payment is confirmed.</p>`
    : '';

  const bodyHtml = `
    <p><strong>${registrantName}</strong> has registered your organization <strong>${organizationName}</strong> for <strong>${serviceTitle}</strong> on ProManager.</p>
    <p>You are the <strong>administrator</strong> of <strong>${organizationName}</strong>.</p>
    ${credentialsBlock}
    <p style="color: #6b7280; font-size: 14px;">Complete payment to activate your workspace using the button below.</p>
  `;

  const textPassword = temporaryPassword
    ? `\n\nTemporary password: ${temporaryPassword}\n`
    : pendingReview
      ? '\n\nYour workspace is pending review.\n'
      : '';

  const bodyText = `${registrantName} registered ${organizationName} for ${serviceTitle}.\n\nYou are the administrator of ${organizationName}.${textPassword}`;

  const { html, text } = emailShell({
    title: 'You are the administrator',
    greeting: managerName,
    bodyHtml,
    bodyText,
    paymentUrl,
  });

  return {
    subject: `You are the administrator of ${organizationName}`,
    html,
    text,
  };
}

export function buildServiceActivationEmail({
  recipientName,
  organizationName,
  roleName,
  loginPath,
  email,
  temporaryPassword,
  expiresAt,
}) {
  const frontendUrl = getFrontendUrl();
  const loginUrl = `${frontendUrl}${loginPath.startsWith('/') ? loginPath : `/${loginPath}`}`;
  const expiryLabel = expiresAt
    ? new Date(expiresAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : `in ${3} days`;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
      <h2 style="color: #059669; margin-bottom: 8px;">Congratulations — your account is ready!</h2>
      <p>Hello ${recipientName},</p>
      <p>Your registration for <strong>${organizationName}</strong> on ProManager has been approved.</p>
      <p>Use the credentials below to sign in. They expire on <strong>${expiryLabel}</strong>.</p>
      <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 0 0 8px;"><strong>Temporary password:</strong> <code style="font-size: 15px;">${temporaryPassword}</code></p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Change your password after your first sign-in if prompted.</p>
      </div>
      <p style="margin: 28px 0;">
        <a href="${loginUrl}" style="background: #059669; color: #fff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Sign in to ${roleName.replace(/_/g, ' ')}</a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">Login page: <a href="${loginUrl}">${loginUrl}</a></p>
      <p style="color: #6b7280; font-size: 14px;">— The ProManager Team</p>
    </div>
  `;

  const text = `Hello ${recipientName},\n\nYour account for ${organizationName} is ready.\nRole: ${roleName}\nEmail: ${email}\nTemporary password: ${temporaryPassword}\nExpires: ${expiryLabel}\n\nSign in: ${loginUrl}\n\n— The ProManager Team`;

  return {
    subject: `Welcome to ProManager — your ${roleName.replace(/_/g, ' ')} access is ready`,
    html,
    text,
  };
}

/** @deprecated Use buildRegistrantIsManagerEmail / buildManagerAdminEmail instead */
export function buildRegistrationThankYouEmail(props) {
  if (props.registeredBySomeoneElse) {
    return buildManagerAdminEmail({
      managerName: props.managerName,
      serviceTitle: props.serviceTitle,
      organizationName: props.organizationName,
      registrantName: props.registrantName,
      serviceId: props.serviceId,
      registrationId: props.registrationId,
      temporaryPassword: props.temporaryPassword,
      pendingReview: props.pendingReview,
    });
  }
  return buildRegistrantIsManagerEmail({
    registrantName: props.managerName,
    serviceTitle: props.serviceTitle,
    organizationName: props.organizationName,
    serviceId: props.serviceId,
    registrationId: props.registrationId,
  });
}
