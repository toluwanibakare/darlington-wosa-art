<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user, public string $otp) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Verification Code - Darlington Wosa Art',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    private function buildHtml(): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5F2EB;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;">
<tr><td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid #E5E0D8;">
<h1 style="font-family:Georgia,serif;font-size:20px;color:#111111;margin:0 0 4px;">Verify Your Email</h1>
<p style="font-family:Arial,sans-serif;font-size:12px;color:#5C5C5C;margin:0;">{$this->user->email}</p>
</td></tr>
<tr><td style="padding:40px;text-align:center;">
<p style="font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 24px;">Use the code below to complete your registration:</p>
<div style="background:#F5F2EB;border-radius:8px;padding:24px 40px;display:inline-block;">
<span style="font-family:monospace;font-size:36px;color:#9E651B;letter-spacing:8px;font-weight:bold;">{$this->otp}</span>
</div>
<p style="font-family:Arial,sans-serif;font-size:12px;color:#5C5C5C;margin-top:24px;">This code expires in 10 minutes.</p>
</td></tr>
<tr><td style="padding:20px 40px;text-align:center;border-top:1px solid #E5E0D8;">
<p style="font-family:Arial,sans-serif;font-size:10px;color:#9E651B;margin:0;">Darlington Wosa Art & Frames Ltd</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>
HTML;
    }
}
