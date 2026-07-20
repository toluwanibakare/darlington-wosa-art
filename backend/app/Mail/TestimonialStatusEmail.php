<?php

namespace App\Mail;

use App\Models\Testimonial;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestimonialStatusEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Testimonial $testimonial) {}

    public function envelope(): Envelope
    {
        $subject = $this->testimonial->status === 'approved'
            ? 'Your Testimonial Has Been Approved'
            : 'Your Testimonial Status Update';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    private function buildHtml(): string
    {
        $icon = $this->testimonial->status === 'approved' ? '&#10003;' : '&#9888;';
        $msg = $this->testimonial->status === 'approved'
            ? 'Your testimonial has been approved and is now visible on our website. Thank you for sharing your experience!'
            : 'Your testimonial has been reviewed. Please see the feedback below.';

        $reply = $this->testimonial->admin_reply
            ? '<tr><td style="padding:16px;background:#F5F2EB;border-radius:6px;margin-top:16px;font-family:Arial,sans-serif;font-size:13px;color:#111111;"><strong style="color:#9E651B;">Admin Response:</strong><br>' . e($this->testimonial->admin_reply) . '</td></tr>'
            : '';

        return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5F2EB;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;">
<tr><td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid #E5E0D8;">
<div style="font-size:40px;color:#9E651B;margin-bottom:8px;">{$icon}</div>
<h1 style="font-family:Georgia,serif;font-size:20px;color:#111111;margin:0;">Testimonial {$this->testimonial->status}</h1>
</td></tr>
<tr><td style="padding:30px 40px;text-align:center;">
<p style="font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;line-height:1.6;margin:0 0 16px;">{$msg}</p>
<p style="font-family:Georgia,serif;font-size:15px;color:#111111;font-style:italic;margin:0 0 16px;">"{$this->testimonial->content}"</p>
{$reply}
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
