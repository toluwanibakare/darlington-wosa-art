<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactReceivedEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contact) {}

    public function envelope(): Envelope
    {
        $subject = $this->contact->subject ?: 'New Enquiry';

        return new Envelope(
            subject: 'New enquiry: ' . $subject,
            replyTo: [new Address($this->contact->email, $this->contact->name)],
        );
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->buildHtml());
    }

    private function buildHtml(): string
    {
        $name = e($this->contact->name);
        $email = e($this->contact->email);
        $phone = e($this->contact->phone ?: 'Not provided');
        $subject = e($this->contact->subject ?: 'No subject');
        $message = nl2br(e($this->contact->message));

        return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5F2EB;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;">
<tr><td style="padding:32px 40px 20px;border-bottom:1px solid #E5E0D8;">
<h1 style="font-family:Georgia,serif;font-size:20px;color:#111111;margin:0 0 4px;">New Enquiry</h1>
<p style="font-family:Arial,sans-serif;font-size:12px;color:#5C5C5C;margin:0;">{$subject}</p>
</td></tr>
<tr><td style="padding:32px 40px;font-family:Arial,sans-serif;font-size:14px;color:#111111;line-height:1.6;">
<p style="margin:0 0 4px;"><strong>Name:</strong> {$name}</p>
<p style="margin:0 0 4px;"><strong>Email:</strong> {$email}</p>
<p style="margin:0 0 20px;"><strong>Phone:</strong> {$phone}</p>
<div style="background:#F5F2EB;border-radius:8px;padding:20px;color:#111111;">{$message}</div>
<p style="font-size:12px;color:#5C5C5C;margin:20px 0 0;">Reply to this email to respond directly to the customer.</p>
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
