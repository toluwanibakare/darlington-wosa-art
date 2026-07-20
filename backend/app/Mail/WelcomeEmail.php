<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Darlington Wosa Art & Frames',
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
<table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;">
<tr><td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid #E5E0D8;">
<h1 style="font-family:Georgia,serif;font-size:22px;color:#111111;margin:0 0 8px;">Welcome, {$this->user->name}</h1>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#9E651B;margin:0;text-transform:uppercase;letter-spacing:2px;">Darlington Wosa Art & Frames</p>
</td></tr>
<tr><td style="padding:30px 40px;">
<p style="font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;line-height:1.7;margin:0 0 20px;">Thank you for joining Darlington Wosa Art & Frames. Your journey into the world of premium art and creativity begins here.</p>
<table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:20px;">
<tr><td style="padding:16px;background:#F5F2EB;border-radius:6px;font-family:Arial,sans-serif;font-size:13px;color:#111111;">
<strong style="color:#9E651B;">What you can do:</strong><br>
- Browse our exclusive art collection<br>
- Book art classes and workshops<br>
- Track your orders in real-time<br>
- Earn rewards through referrals<br>
- Get cashback on video submissions
</td></tr>
</table>
<a href="https://darlingtonwosa.art/dashboard" style="display:inline-block;padding:14px 32px;background:#111111;color:#FFFFFF;border:1px solid #9E651B;border-radius:6px;font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;">Go to Dashboard</a>
</td></tr>
<tr><td style="padding:20px 40px;text-align:center;border-top:1px solid #E5E0D8;">
<p style="font-family:Arial,sans-serif;font-size:11px;color:#9E651B;margin:0;">Darlington Wosa Art & Frames Ltd &mdash; Rivers State, Nigeria</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>
HTML;
    }
}
