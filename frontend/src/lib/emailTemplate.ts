import { academyInterests, type AcademyInterest } from './academyInterest'
export function emailHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#ececec;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ececec;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 40px;border-bottom:1px solid #e0e0e0;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#9b5152;">
                The Robot Age
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e0e0e0;">
              <p style="margin:0;font-family:Georgia,serif;font-size:11px;color:#aaa;line-height:1.7;">
                therobotage.com — Robotic literacy for non-engineers.<br />
                You're receiving this because you interacted with The Robot Age.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Bulk (non-transactional) email wrapper.
//
// emailHtml() above is used by four transactional senders and its footer carries no
// physical postal address. CAN-SPAM requires one on commercial bulk mail, along with a
// conspicuous unsubscribe, so recurring sends like the weekly job digest use this
// wrapper instead. emailHtml() itself is deliberately left unchanged.
export function bulkEmailHtml(
  content: string,
  options: { unsubscribeUrl: string; preferencesUrl?: string; reason?: string }
): string {
  const address =
    process.env.MAILING_ADDRESS ?? 'The Robot Age, United States'
  const reason =
    options.reason ?? 'You are receiving this because you subscribed to robotics job alerts at therobotage.com.'

  const footer = `
    <hr style="border:none;border-top:1px solid #e0e0e0;margin:32px 0 20px;" />
    <p style="font-family:Georgia,serif;font-size:11px;color:#aaa;line-height:1.7;margin:0 0 8px;">
      ${reason}
    </p>
    <p style="font-family:Georgia,serif;font-size:11px;color:#aaa;line-height:1.7;margin:0 0 8px;">
      ${escapeHtml(address)}
    </p>
    <p style="font-family:Georgia,serif;font-size:11px;color:#aaa;line-height:1.7;margin:0;">
      ${options.preferencesUrl ? `<a href="${options.preferencesUrl}" style="color:#9b5152;">Update your preferences</a> &nbsp;·&nbsp; ` : ''}<a href="${options.unsubscribeUrl}" style="color:#9b5152;">Unsubscribe</a>
    </p>
  `

  return emailHtml(`${content}${footer}`)
}

export function workshopWaitlistHtml(firstName: string): string {
  return emailHtml(`
    <h1 style="font-family:Arial,sans-serif;font-weight:400;font-size:24px;letter-spacing:-0.02em;line-height:1.15;color:#0D0D0D;margin:0 0 20px;">
      You're on the list, ${firstName}.
    </h1>

    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
      The RXD Free Workshop is currently full — but we've added you to the waitlist.
    </p>

    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 32px;">
      If a spot opens up, we'll reach out to you directly with everything you need to join. In the meantime, explore the RXD framework to get a head start on the vocabulary and concepts we'll cover.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 40px;">
      <tr>
        <td style="background:#9b5152;">
          <a href="https://therobotage.com/rxd"
             style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;color:#ffffff;text-decoration:none;">
            Explore the RXD framework →
          </a>
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #e0e0e0;margin:0 0 32px;" />

    <p style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9b5152;margin:0 0 14px;">
      About the workshop
    </p>
    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
      The workshop is a live 45-minute session designed for non-engineers — Designers, Product Managers, UX Designers, Strategists, and Project Managers who work in environments where robots are already deployed.
    </p>
    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0;">
      You'll leave with a clear understanding of the RXD framework, hands-on practice scoring a real robot case, and vocabulary to communicate confidently about robot experience to any stakeholder.
    </p>
  `)
}

export function waitlistConfirmationHtml(interest: AcademyInterest = 'academy', locale: 'en' | 'es' = 'en', name = ''): string {
  const label = academyInterests[interest][locale]
  const title = locale === 'es' ? 'Gracias por tu interés en The Robot Age Academy' : 'Thanks for your interest in The Robot Age Academy'
  const note = locale === 'es'
    ? 'Recibirás novedades del programa. Inscribirte en esta lista no reserva una plaza ni confirma una matrícula.'
    : 'You will receive program updates. Joining this list does not reserve a seat or confirm enrollment.'
  const url = `https://therobotage.com${locale === 'es' ? '/es' : ''}/learn${interest === 'academy' ? '' : `/${interest}`}`
  return emailHtml(`<h1>${title}</h1><p>${escapeHtml(label)}</p><p>${note}</p>${name ? `<p>${escapeHtml(name)}</p>` : ''}<p><a href="${url}">${locale === 'es' ? 'Explorar el programa' : 'Explore the program'}</a></p>`)
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
