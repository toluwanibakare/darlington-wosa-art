<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactAcknowledgementEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contact) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We have received your message - Darlington Wosa Art',
        );
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->buildHtml());
    }

    private function buildHtml(): string
    {
        $name = e($this->contact->name);
        $message = nl2br(e($this->contact->message));

        return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5F2EB;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;">
<tr><td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid #E5E0D8;">
<h1 style="font-family:Georgia,serif;font-size:20px;color:#111111;margin:0;">Thank you, {$name}</h1>
</td></tr>
<tr><td style="padding:32px 40px;font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;line-height:1.6;">
<p style="margin:0 0 16px;">We have received your message and will get back to you shortly. A copy is below for your records.</p>
<div style="background:#F5F2EB;border-radius:8px;padding:20px;color:#111111;font-size:13px;">{$message}</div>
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
