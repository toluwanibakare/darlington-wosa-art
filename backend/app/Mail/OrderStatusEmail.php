<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order, public string $oldStatus) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Order {$this->order->order_number} - {$this->order->status}",
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
        $statusBadge = match($this->order->status) {
            'paid' => '<span style="color:#16a34a;">Paid</span>',
            'processing' => '<span style="color:#9E651B;">Processing</span>',
            'shipped' => '<span style="color:#2563eb;">Shipped</span>',
            'completed' => '<span style="color:#16a34a;">Completed</span>',
            'cancelled' => '<span style="color:#dc2626;">Cancelled</span>',
            default => '<span style="color:#5C5C5C;">Pending</span>',
        };

        return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5F2EB;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;">
<tr><td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid #E5E0D8;">
<h1 style="font-family:Georgia,serif;font-size:20px;color:#111111;margin:0 0 4px;">Order Update</h1>
<p style="font-family:monospace;font-size:14px;color:#9E651B;margin:0;">#{$this->order->order_number}</p>
</td></tr>
<tr><td style="padding:30px 40px;text-align:center;">
<p style="font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 20px;">Your order status has changed from <strong>{$this->oldStatus}</strong> to:</p>
<div style="font-family:Arial,sans-serif;font-size:28px;font-weight:bold;margin:0 0 20px;">{$statusBadge}</div>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#111111;margin:0 0 4px;">Amount: <strong>₦" . number_format((float) $this->order->amount, 2) . "</strong></p>
<a href="https://darlingtonwosa.art/dashboard/orders/{$this->order->id}" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#111111;color:#FFFFFF;border:1px solid #9E651B;border-radius:6px;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;text-decoration:none;">View Order</a>
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
