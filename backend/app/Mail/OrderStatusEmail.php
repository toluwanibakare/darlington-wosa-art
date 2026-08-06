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
        $subject = match($this->order->status) {
            'paid'        => "Order Received - {$this->order->order_number}",
            'processing'  => "Your Order is Now Being Processed - {$this->order->order_number}",
            'shipped'     => "Your Order Has Been Shipped - {$this->order->order_number}",
            'completed'   => "Order Completed - {$this->order->order_number}",
            'cancelled'   => "Order Cancelled - {$this->order->order_number}",
            default       => "Order Update - {$this->order->order_number}",
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->buildHtml());
    }

    private function buildHtml(): string
    {
        $status    = $this->order->status;
        $orderNum  = $this->order->order_number;
        $amount    = '&#8358;' . number_format((float) $this->order->amount, 2);
        $trackUrl  = "https://darlingtonwosa.art/dashboard?order_number={$orderNum}";

        // --- Per-status copy blocks ---
        $headerLine  = '';
        $accentColor = '#9E651B';
        $bodyHtml    = '';

        if ($status === 'paid') {
            $headerLine  = 'Order Successfully Received';
            $accentColor = '#16a34a';
            $bodyHtml    = "
<p style=\"font-family:Arial,sans-serif;font-size:15px;color:#111111;margin:0 0 16px;line-height:1.7;\">
  Thank you for your order. Your payment has been confirmed and your request is now in our hands.
</p>
<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 16px;line-height:1.7;\">
  We will review the details of your project carefully. If we need any additional information before we begin, we will reach out to you promptly. Otherwise, we will proceed to start working on your order shortly.
</p>
<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 28px;line-height:1.7;\">
  You will receive a follow-up email each time your order status changes, so you are always kept informed every step of the way.
</p>";
        } elseif ($status === 'processing') {
            $headerLine  = 'Your Order is Being Processed';
            $accentColor = '#9E651B';
            $bodyHtml    = "
<p style=\"font-family:Arial,sans-serif;font-size:15px;color:#111111;margin:0 0 16px;line-height:1.7;\">
  Great news. Our team has begun working on your order and it is now in production.
</p>
<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 28px;line-height:1.7;\">
  We will notify you as soon as the next milestone is reached. You can also track the live status of your order at any time using the button below.
</p>";
        } elseif ($status === 'shipped') {
            $headerLine  = 'Your Order is On Its Way';
            $accentColor = '#2563eb';
            $bodyHtml    = "
<p style=\"font-family:Arial,sans-serif;font-size:15px;color:#111111;margin:0 0 16px;line-height:1.7;\">
  Your order has been dispatched and is on its way to you.
</p>
<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 28px;line-height:1.7;\">
  Please ensure someone is available to receive the delivery. Use the tracking link below for real-time updates.
</p>";
        } elseif ($status === 'completed') {
            $headerLine  = 'Order Completed';
            $accentColor = '#16a34a';
            $bodyHtml    = "
<p style=\"font-family:Arial,sans-serif;font-size:15px;color:#111111;margin:0 0 16px;line-height:1.7;\">
  Your order has been completed. We hope you love the result.
</p>
<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 28px;line-height:1.7;\">
  It was a pleasure working with you. If you have any feedback or would like to place a new order, feel free to reach out or visit our website anytime.
</p>";
        } elseif ($status === 'cancelled') {
            $headerLine  = 'Order Cancelled';
            $accentColor = '#dc2626';
            $bodyHtml    = "
<p style=\"font-family:Arial,sans-serif;font-size:15px;color:#111111;margin:0 0 16px;line-height:1.7;\">
  Unfortunately, your order has been cancelled.
</p>
<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 28px;line-height:1.7;\">
  If you believe this was an error or would like to discuss your order further, please do not hesitate to contact us directly. We are always happy to help.
</p>";
        } else {
            $headerLine = 'Order Update';
            $bodyHtml   = "
<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#5C5C5C;margin:0 0 28px;line-height:1.7;\">
  There has been an update to your order. Please use the button below to view the latest status.
</p>";
        }

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
      <table width="580" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:10px;overflow:hidden;border:1px solid #E5E0D8;">

        <!-- Header Bar -->
        <tr>
          <td style="background:{$accentColor};padding:6px 0;"></td>
        </tr>

        <!-- Brand Header -->
        <tr>
          <td style="padding:36px 48px 28px;text-align:center;border-bottom:1px solid #F0EDE6;">
            <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#9E651B;margin:0 0 10px;">Darlington Wosa Art &amp; Frames Ltd</p>
            <h1 style="font-family:Georgia,serif;font-size:22px;color:#111111;margin:0;font-weight:normal;letter-spacing:1px;">{$headerLine}</h1>
          </td>
        </tr>

        <!-- Order Number + Amount -->
        <tr>
          <td style="padding:24px 48px 0;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="padding:10px 24px;background:#F5F2EB;border-radius:6px;border:1px solid #E5E0D8;text-align:center;">
                  <p style="font-family:monospace;font-size:12px;color:#5C5C5C;margin:0 0 2px;letter-spacing:1px;text-transform:uppercase;">Order Reference</p>
                  <p style="font-family:monospace;font-size:16px;color:#9E651B;margin:0;font-weight:bold;">{$orderNum}</p>
                </td>
                <td style="padding:0 16px;"></td>
                <td style="padding:10px 24px;background:#F5F2EB;border-radius:6px;border:1px solid #E5E0D8;text-align:center;">
                  <p style="font-family:Arial,sans-serif;font-size:12px;color:#5C5C5C;margin:0 0 2px;letter-spacing:1px;text-transform:uppercase;">Amount Paid</p>
                  <p style="font-family:Arial,sans-serif;font-size:16px;color:#111111;margin:0;font-weight:bold;">{$amount}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body Copy -->
        <tr>
          <td style="padding:28px 48px 0;">
            {$bodyHtml}
          </td>
        </tr>

        <!-- CTA Button -->
        <tr>
          <td style="padding:0 48px 36px;text-align:center;">
            <a href="{$trackUrl}" style="display:inline-block;padding:14px 36px;background:#111111;color:#FFFFFF;border:1px solid #9E651B;border-radius:6px;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;">
              Track Your Order
            </a>
          </td>
        </tr>

        <!-- Divider Note -->
        <tr>
          <td style="padding:20px 48px;border-top:1px solid #F0EDE6;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#AAAAAA;margin:0;line-height:1.6;">
              You are receiving this email because an order was placed on your account.<br>
              For any queries, please reach out via our website at <a href="https://darlingtonwosa.art/contact" style="color:#9E651B;text-decoration:none;">darlingtonwosa.art</a>
            </p>
          </td>
        </tr>

        <!-- Footer Bar -->
        <tr>
          <td style="background:{$accentColor};padding:4px 0;"></td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
    }
}
