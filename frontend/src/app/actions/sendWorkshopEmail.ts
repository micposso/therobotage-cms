'use server'

import fs from 'fs'
import { Resend } from 'resend'
import { emailHtml, escapeHtml } from '@/lib/emailTemplate'

const FROM_ADDRESS = process.env.EMAIL_FROM_HELLO ?? 'onboarding@resend.dev'
const ADMIN_ADDRESS = 'micposso@gmail.com'
const REGISTRY_FILE = '/tmp/rxd-workshop-emails.json'

let _emailCache: Set<string> | null = null

function getRegistry(): Set<string> {
  if (_emailCache) return _emailCache
  try {
    const raw = fs.readFileSync(REGISTRY_FILE, 'utf-8')
    _emailCache = new Set(JSON.parse(raw) as string[])
  } catch {
    _emailCache = new Set()
  }
  return _emailCache
}

function persistEmail(email: string): void {
  const registry = getRegistry()
  registry.add(email)
  try {
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify([...registry]))
  } catch {
    // in-memory cache still prevents duplicates within this instance
  }
}

export async function sendWorkshopEmail(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const firstName  = (formData.get('firstName')  as string | null)?.trim()
  const lastName   = (formData.get('lastName')   as string | null)?.trim()
  const email      = (formData.get('email')      as string | null)?.trim()
  const profession = (formData.get('profession') as string | null)?.trim()
  const heard      = (formData.get('heard')      as string | null)?.trim()

  if (!firstName)  return { success: false, error: 'Please enter your first name.' }
  if (!lastName)   return { success: false, error: 'Please enter your last name.' }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { success: false, error: 'Please enter a valid email address.' }
  if (!profession) return { success: false, error: 'Please select your profession.' }
  if (!heard)      return { success: false, error: 'Please tell us how you heard about this workshop.' }

  const normalizedEmail = email.toLowerCase()
  if (getRegistry().has(normalizedEmail)) {
    return { success: false, error: 'This email is already registered. Check your inbox for the confirmation we sent.' }
  }

  const safeFirst      = escapeHtml(firstName)
  const safeFull       = escapeHtml(`${firstName} ${lastName}`)
  const safeEmail      = escapeHtml(email)
  const safeProfession = escapeHtml(profession)
  const safeHeard      = escapeHtml(heard)

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const [{ error: confirmError }, { error: adminError }] = await Promise.all([

      // Receipt to registrant
      resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: "You're registered — RXD Free Workshop",
        html: emailHtml(`
          <h1 style="font-family:Arial,sans-serif;font-weight:400;font-size:24px;letter-spacing:-0.02em;line-height:1.15;color:#0D0D0D;margin:0 0 20px;">
            You're in, ${safeFirst}.
          </h1>

          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
            Thanks for registering for the RXD Framework free workshop. We'll send you the session link and schedule closer to the date — keep an eye on your inbox.
          </p>

          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 32px;">
            In the meantime, you can explore the RXD framework to get a head start on the vocabulary and concepts we'll cover together.
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
            What to expect
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
            The workshop is a live 45-minute session designed for non-engineers — Designers, Product Managers, UX Designers, Strategists, and Project Managers who work in environments where robots are already deployed.
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0;">
            You'll leave with a clear understanding of the RXD framework, hands-on practice scoring a real robot case, and vocabulary to communicate confidently about robot experience to any stakeholder.
          </p>
        `),
      }),

      // Admin notification
      resend.emails.send({
        from: FROM_ADDRESS,
        to: ADMIN_ADDRESS,
        subject: `New workshop registration — ${safeFull}`,
        html: emailHtml(`
          <p style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9b5152;margin:0 0 20px;">
            RXD Free Workshop — Registration
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#2A2A28;margin:0 0 8px;">
            <strong>Name:</strong> ${safeFull}
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#2A2A28;margin:0 0 8px;">
            <strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#9b5152;">${safeEmail}</a>
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#2A2A28;margin:0 0 8px;">
            <strong>Profession:</strong> ${safeProfession}
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#2A2A28;margin:0 0 24px;">
            <strong>How they heard:</strong> ${safeHeard}
          </p>
        `),
      }),

    ])

    if (confirmError || adminError) {
      console.error('sendWorkshopEmail error:', confirmError ?? adminError)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }

    persistEmail(normalizedEmail)
    return { success: true }
  } catch (err) {
    console.error('sendWorkshopEmail exception:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
