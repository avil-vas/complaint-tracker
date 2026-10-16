import nodemailer from "nodemailer"

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }
  return transporter;
}

/**
 * Sends a confirmation email to the student when a new complaint is filed.
 */
export const sendComplaintConfirmation = async (studentEmail, studentName, complaintId, category, priority) => {
  try {
    // Check if mail configuration is missing or holds placeholder values
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
        process.env.EMAIL_USER === "your_gmail@gmail.com" || 
        process.env.EMAIL_PASS === "your_16_char_app_password") {
      console.warn("Nodemailer configuration is skipped (missing or default email/password in .env).");
      return;
    }

    // Determine colors for the priority badge
    let badgeBg = "#f3f4f6"; // Slate/gray fallback
    let badgeText = "#4b5563";
    const prio = (priority || "").toLowerCase();
    if (prio.includes("high")) {
      badgeBg = "#ffe4e6";
      badgeText = "#e11d48";
    } else if (prio.includes("medium")) {
      badgeBg = "#ffedd5";
      badgeText = "#ea580c";
    } else if (prio.includes("low")) {
      badgeBg = "#dcfce7";
      badgeText = "#16a34a";
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; margin: 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; font-family: inherit;">Campus Complaint Tracker</h1>
              <p style="margin: 6px 0 0 0; color: #bfdbfe; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">Grievance Desk Notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Dear ${studentName},</h2>
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                We have successfully received your grievance. It has been processed and automatically routed to the corresponding department. You can track its live progress on the dashboard.
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding-bottom: 12px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 130px;">Complaint ID</td>
                        <td style="padding-bottom: 12px; color: #0f172a; font-size: 15px; font-weight: 700;">#${complaintId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Category</td>
                        <td style="padding: 12px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${category || "General"}</td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Priority</td>
                        <td style="padding-top: 12px; align-items: center;">
                          <span style="display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 800; border-radius: 9999px; background-color: ${badgeBg}; color: ${badgeText}; text-transform: uppercase;">
                            ${priority || "Medium"}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                You will receive another update as soon as our administrative cell changes the status or updates details on this complaint.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
                <tr>
                  <td style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
                    This is an automated notification from the Campus Complaint Tracker system. <br />
                    Please do not reply directly to this mail.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    const mailOptions = {
      from: `"Campus Complaint Desk" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Complaint Received - #${complaintId}`,
      html: htmlContent
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`[Email Confirmation] Successfully sent confirmation email for Complaint #${complaintId} to ${studentEmail}`);
  } catch (error) {
    console.error(`[Email Confirmation Error] Failed to send confirmation email to ${studentEmail} for Complaint #${complaintId}:`, error.message);
  }
}

/**
 * Sends a status update email to the student when their complaint is updated.
 */
export const sendStatusUpdate = async (studentEmail, studentName, complaintId, oldStatus, newStatus, department) => {
  try {
    // Check if mail configuration is missing or holds placeholder values
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
        process.env.EMAIL_USER === "your_gmail@gmail.com" || 
        process.env.EMAIL_PASS === "your_16_char_app_password") {
      console.warn("Nodemailer configuration is skipped (missing or default email/password in .env).");
      return;
    }

    // Determine colors for the status badge
    let badgeBg = "#f3f4f6"; // Slate/gray fallback
    let badgeText = "#4b5563";
    const status = (newStatus || "").toLowerCase();
    if (status.includes("resolved")) {
      badgeBg = "#dcfce7";
      badgeText = "#16a34a";
    } else if (status.includes("progress")) {
      badgeBg = "#e0f2fe";
      badgeText = "#0284c7";
    } else if (status.includes("pending")) {
      badgeBg = "#fef3c7";
      badgeText = "#d97706";
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; margin: 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; font-family: inherit;">Campus Complaint Tracker</h1>
              <p style="margin: 6px 0 0 0; color: #bfdbfe; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">Status Update Notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Dear ${studentName},</h2>
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                The status of your registered grievance has been updated by the department officer.
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding-bottom: 12px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 130px;">Complaint ID</td>
                        <td style="padding-bottom: 12px; color: #0f172a; font-size: 15px; font-weight: 700;">#${complaintId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Department</td>
                        <td style="padding: 12px 0; color: #0f172a; font-size: 15px; font-weight: 600; text-transform: capitalize;">${department || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Old Status</td>
                        <td style="padding: 12px 0; color: #64748b; font-size: 15px; font-weight: 500;">${oldStatus}</td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">New Status</td>
                        <td style="padding-top: 12px; align-items: center;">
                          <span style="display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 800; border-radius: 9999px; background-color: ${badgeBg}; color: ${badgeText}; text-transform: uppercase;">
                            ${newStatus}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                Please log in to your account dashboard to view additional feedback or check details.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
                <tr>
                  <td style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
                    This is an automated notification from the Campus Complaint Tracker system. <br />
                    Please do not reply directly to this mail.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    const mailOptions = {
      from: `"Campus Complaint Desk" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Complaint #${complaintId} Status Updated`,
      html: htmlContent
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`[Email Update] Successfully sent status update email for Complaint #${complaintId} to ${studentEmail}`);
  } catch (error) {
    console.error(`[Email Update Error] Failed to send status update email to ${studentEmail} for Complaint #${complaintId}:`, error.message);
  }
}
