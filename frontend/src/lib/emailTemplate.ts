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

export function waitlistConfirmationHtml(): string {
  return emailHtml(`
    <h1 style="font-family:Arial,sans-serif;font-weight:400;font-size:24px;letter-spacing:-0.02em;line-height:1.15;color:#0D0D0D;margin:0 0 20px;">
      You're first in line.
    </h1>

    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
      Registration for the <strong>HREF Certification</strong> isn't open yet — but when it is, you'll hear before anyone else.
    </p>

    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 32px;">
      We'll send you the cohort schedule, founding-member pricing, and everything you need to register — before the public announcement goes out. No noise in the meantime.
    </p>

    <hr style="border:none;border-top:1px solid #e0e0e0;margin:0 0 32px;" />

    <p style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9b5152;margin:0 0 14px;">
      About the HREF Certification
    </p>
    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
      The Human-Robot Experience Framework (HREF) Certification is built for designers, product managers, strategists, and operations leads who work in environments where robots are already deployed. No engineering background required.
    </p>
    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
      Four credential tracks cover the decisions that matter most when humans and robots share a space — from experience design and change management to policy and deployment strategy. You'll finish with a credential that reflects the work you actually do, and the vocabulary to do it with confidence.
    </p>
    <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0;">
      The first cohort is limited to ten seats at founding-member pricing. You're on the list — we'll be in touch.
    </p>
  `)
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
