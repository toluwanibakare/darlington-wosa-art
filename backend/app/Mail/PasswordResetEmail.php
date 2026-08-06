<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $name, public string $resetUrl) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reset Your Password - Darlington Wosa Art & Frames');
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->buildHtml());
    }

    private function buildHtml(): string
    {
        $name     = htmlspecialchars($this->name);
        $resetUrl = $this->resetUrl;

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F5F2EB;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:48px 20px;">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:10px;overflow:hidden;border:1px solid #E5E0D8;">

        <!-- Header Bar -->
        <tr><td bgcolor="#9E651B" style="padding:5px 0;"></td></tr>

        <!-- Brand Header -->
        <tr>
          <td style="padding:36px 48px 24px;text-align:center;border-bottom:1px solid #F0EDE6;">
            <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#9E651B;margin:0 0 10px;">Darlington Wosa Art &amp; Frames Ltd</p>
            <h1 style="font-family:Georgia,serif;font-size:22px;color:#111111;margin:0;font-weight:normal;letter-spacing:1px;">Password Reset Request</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 48px 8px;">
            <p style="font-family:Arial,sans-serif;font-size:15px;color:#111111;margin:0 0 16px;line-height:1.7;">Hello {$name},</p>
            <p style="font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 16px;line-height:1.7;">
              We received a request to reset the password on your account. Click the button below to choose a new password.
            </p>
            <p style="font-family:Arial,sans-serif;font-size:13px;color:#AAAAAA;margin:0 0 28px;line-height:1.7;">
              This link will expire in <strong style="color:#111111;">60 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- CTA Button -->
        <tr>
          <td style="padding:0 48px 36px;text-align:center;">
            <table cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td align="center" bgcolor="#111111" style="border-radius:6px;border:1px solid #9E651B;">
                  <a href="{$resetUrl}" style="padding:14px 40px;font-family:Arial,sans-serif;font-size:11px;color:#FFFFFF;text-transform:uppercase;letter-spacing:2px;text-decoration:none;font-weight:bold;white-space:nowrap;">Reset My Password</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer Note -->
        <tr>
          <td style="padding:20px 48px;border-top:1px solid #F0EDE6;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#AAAAAA;margin:0;line-height:1.6;">
              If the button above does not work, copy and paste this link into your browser:<br>
              <a href="{$resetUrl}" style="color:#9E651B;text-decoration:none;word-break:break-all;">{$resetUrl}</a>
            </p>
          </td>
        </tr>

        <!-- Footer Bar -->
        <tr><td bgcolor="#9E651B" style="padding:4px 0;"></td></tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
    }
}
