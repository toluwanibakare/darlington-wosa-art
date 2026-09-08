import nodemailer from 'nodemailer';

interface EnquiryEmailParams {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  category?: string;
  message?: string;
  details?: Record<string, string | number | undefined>;
}

interface OrderEmailParams {
  orderRef: string;
  name: string;
  email: string;
  phone?: string;
  activeTab?: string;
  itemTitle?: string;
  dimensions?: string;
  artType?: string;
  frameType?: string;
  amount: number;
  deliveryState?: string;
  deliveryAddress?: string;
  deliveryTimeline?: string;
  notes?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback transporter when live SMTP environment variables are not yet populated
  return null;
}

export async function sendEnquiryDeliveryEmail(data: EnquiryEmailParams): Promise<{ success: boolean; message: string }> {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_FROM || 'Darlington Wosa Art <no-reply@darlingtonwosa.art>';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'info@darlingtonwosa.art';

  const userHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F5F2EB; margin: 0; padding: 30px 10px; color: #111111; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E5E0D8; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
          .header { background-color: #111111; color: #FFFFFF; padding: 32px 24px; text-align: center; }
          .header h1 { font-family: Georgia, serif; font-size: 24px; margin: 0; color: #9E651B; font-weight: normal; letter-spacing: 2px; text-transform: uppercase; }
          .header p { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A0A0A0; margin-top: 6px; }
          .content { padding: 32px 24px; font-size: 14px; line-height: 1.6; color: #333333; }
          .greeting { font-family: Georgia, serif; font-size: 18px; color: #111111; margin-bottom: 16px; }
          .badge { display: inline-block; background-color: #9E651B; color: #FFFFFF; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
          .summary-box { background-color: #F9F8F5; border-left: 3px solid #9E651B; padding: 16px 20px; margin: 20px 0; border-radius: 0 6px 6px 0; }
          .summary-box p { margin: 6px 0; font-size: 13px; }
          .footer { background-color: #F5F2EB; padding: 24px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #E5E0D8; }
          .footer a { color: #9E651B; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Darlington Wosa Art</h1>
            <p>Frames & Portraiture Studio</p>
          </div>
          <div class="content">
            <div class="greeting">Enquiry Received</div>
            <span class="badge">Status: Confirmation</span>
            <p>Dear ${data.name},</p>
            <p>Thank you for contacting Darlington Wosa Art & Frames Ltd. We have successfully received your enquiry and our art consultation team is reviewing your message.</p>
            
            <div class="summary-box">
              <p><strong>Category:</strong> ${data.category || 'General Enquiry'}</p>
              <p><strong>Subject:</strong> ${data.subject || 'Project Inquiry'}</p>
              <p><strong>Message / Requirements:</strong></p>
              <p style="white-space: pre-line; color: #555555;">${data.message || 'N/A'}</p>
            </div>

            <p>A representative from our studio in Rivers State will reach out to you within 24 hours to discuss your project requirements, specifications, and custom options.</p>
            <p>If your enquiry requires urgent attention, feel free to connect with us directly on WhatsApp at <strong>+234 813 774 4824</strong>.</p>
            
            <p style="margin-top: 24px;">Warm regards,<br><strong>Darlington Wosa Art & Frames Ltd</strong></p>
          </div>
          <div class="footer">
            <p>Darlington Wosa Art & Frames Ltd | Port Harcourt, Rivers State, Nigeria</p>
            <p>Direct WhatsApp: <a href="https://wa.me/2348137744824">+234 813 774 4824</a> | Website: <a href="https://darlingtonwosa.art">darlingtonwosa.art</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      // Send receipt email to customer
      await transporter.sendMail({
        from: fromEmail,
        to: data.email,
        subject: `Enquiry Received - Darlington Wosa Art (${data.subject || 'Inquiry'})`,
        html: userHtml,
      });

      // Send copy notification to admin
      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `New Client Enquiry: ${data.name} (${data.category || 'General'})`,
        html: `<p><strong>Name:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Phone:</strong> ${data.phone || 'N/A'}</p><p><strong>Message:</strong></p><p>${data.message}</p>`,
      });

      return { success: true, message: 'Enquiry email dispatched successfully.' };
    } catch (err) {
      console.error('Error sending enquiry email:', err);
      return { success: false, message: 'Failed to send email via SMTP transport.' };
    }
  }

  // Fallback log mode
  console.log('[EMAIL SYSTEM MOCK] Enquiry delivery email logged for:', data.email);
  return { success: true, message: 'Enquiry confirmation registered successfully.' };
}

export async function sendOrderConfirmationEmail(data: OrderEmailParams): Promise<{ success: boolean; message: string }> {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_FROM || 'Darlington Wosa Art <orders@darlingtonwosa.art>';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'orders@darlingtonwosa.art';

  const formattedAmount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(data.amount);

  const orderHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F5F2EB; margin: 0; padding: 30px 10px; color: #111111; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E5E0D8; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
          .header { background-color: #111111; color: #FFFFFF; padding: 32px 24px; text-align: center; }
          .header h1 { font-family: Georgia, serif; font-size: 24px; margin: 0; color: #9E651B; font-weight: normal; letter-spacing: 2px; text-transform: uppercase; }
          .header p { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A0A0A0; margin-top: 6px; }
          .content { padding: 32px 24px; font-size: 14px; line-height: 1.6; color: #333333; }
          .greeting { font-family: Georgia, serif; font-size: 18px; color: #111111; margin-bottom: 8px; }
          .ref-number { font-size: 13px; color: #9E651B; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
          .order-details { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
          .order-details th { text-align: left; padding: 10px; background-color: #F5F2EB; color: #111111; font-weight: 600; border-bottom: 1px solid #E5E0D8; }
          .order-details td { padding: 12px 10px; border-bottom: 1px solid #F0ECE4; }
          .total-row { font-weight: bold; font-size: 15px; color: #111111; background-color: #FAF8F5; }
          .info-card { background-color: #F9F8F5; border-radius: 6px; padding: 16px; margin: 20px 0; border: 1px solid #E5E0D8; }
          .info-card h4 { margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #9E651B; }
          .footer { background-color: #F5F2EB; padding: 24px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #E5E0D8; }
          .footer a { color: #9E651B; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Darlington Wosa Art</h1>
            <p>Order Confirmation</p>
          </div>
          <div class="content">
            <div class="greeting">Thank You for Your Order</div>
            <div class="ref-number">Order Reference: ${data.orderRef}</div>
            
            <p>Dear ${data.name},</p>
            <p>We are delighted to confirm that your commission order has been successfully placed with Darlington Wosa Art & Frames Ltd.</p>

            <table class="order-details">
              <thead>
                <tr>
                  <th>Specification</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Category</strong></td>
                  <td>${data.activeTab ? data.activeTab.toUpperCase() : 'Commission / Framing'}</td>
                </tr>
                ${data.dimensions ? `<tr><td><strong>Dimensions</strong></td><td>${data.dimensions}</td></tr>` : ''}
                ${data.artType ? `<tr><td><strong>Art Medium</strong></td><td>${data.artType}</td></tr>` : ''}
                ${data.frameType ? `<tr><td><strong>Frame Choice</strong></td><td>${data.frameType}</td></tr>` : ''}
                ${data.deliveryTimeline ? `<tr><td><strong>Delivery Timeline</strong></td><td>${data.deliveryTimeline}</td></tr>` : ''}
                <tr class="total-row">
                  <td><strong>Total Amount</strong></td>
                  <td><strong style="color: #9E651B;">${formattedAmount}</strong></td>
                </tr>
              </tbody>
            </table>

            <div class="info-card">
              <h4>Delivery Information</h4>
              <p style="margin: 0 0 4px 0;"><strong>State:</strong> ${data.deliveryState || 'State Specified'}</p>
              <p style="margin: 0;"><strong>Address:</strong> ${data.deliveryAddress || 'Address on file'}</p>
            </div>

            <p>Our lead artist and framing team will begin preparing your artwork. You can track updates or contact us directly on WhatsApp with your Order Reference.</p>
            
            <p style="margin-top: 24px;">Warm regards,<br><strong>Darlington Wosa Art & Frames Ltd</strong></p>
          </div>
          <div class="footer">
            <p>Darlington Wosa Art & Frames Ltd | Port Harcourt, Rivers State, Nigeria</p>
            <p>Direct WhatsApp: <a href="https://wa.me/2348137744824">+234 813 774 4824</a> | Website: <a href="https://darlingtonwosa.art">darlingtonwosa.art</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: fromEmail,
        to: data.email,
        subject: `Order Confirmation #${data.orderRef} - Darlington Wosa Art`,
        html: orderHtml,
      });

      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `NEW ORDER #${data.orderRef} - ${data.name} (${formattedAmount})`,
        html: `<p>New order received from <strong>${data.name}</strong> (${data.email}, ${data.phone || 'No phone'}).</p><p>Amount: ${formattedAmount}</p><p>Ref: ${data.orderRef}</p>`,
      });

      return { success: true, message: 'Order confirmation email sent successfully.' };
    } catch (err) {
      console.error('Error sending order confirmation email:', err);
      return { success: false, message: 'Failed to send order email via SMTP transport.' };
    }
  }

  console.log('[EMAIL SYSTEM MOCK] Order confirmation email logged for ref:', data.orderRef, 'to:', data.email);
  return { success: true, message: 'Order confirmation registered successfully.' };
}
