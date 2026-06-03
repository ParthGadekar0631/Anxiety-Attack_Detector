const { env } = require("../config/env");

function buildAlertMessage({ user, episode, location }) {
  const mapLink =
    location?.latitude && location?.longitude
      ? `https://maps.google.com/?q=${location.latitude},${location.longitude}`
      : "Location not available";
  return `Emergency support alert: ${user?.name || "A user"} may be experiencing an anxiety/panic episode. Location: ${mapLink}. Medical notes: ${user?.medicalNotes || "None provided"}. Please check on them immediately.`;
}

async function sendEmergencySms({ user, contacts, episode, location }) {
  const provider =
    env.smsProvider === "twilio" && env.twilioAccountSid && env.twilioAuthToken && env.twilioPhoneNumber
      ? "twilio"
      : "mock";
  const message = buildAlertMessage({ user, episode, location });

  const deliveries = contacts.map((contact) => ({
    contactId: String(contact.id || contact._id),
    to: contact.phone,
    provider,
    status: provider === "mock" ? "mock-sent" : "queued",
    message,
    contactName: contact.name,
  }));

  return { provider, message, deliveries };
}

module.exports = { sendEmergencySms, buildAlertMessage };
