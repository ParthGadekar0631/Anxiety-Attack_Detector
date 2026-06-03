const { env } = require("../config/env");
const { insert } = require("./dataStore");

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

  const deliveries = contacts.map((contact) => {
    const action = insert("emergencyActions", {
      userId: user.id,
      episodeId: episode?.id,
      actionType: "sms",
      status: provider === "mock" ? "mock-sent" : "queued",
      details: { provider, to: contact.phone, contactName: contact.name, message },
      timestamp: new Date().toISOString(),
    });
    return { contactId: contact.id, to: contact.phone, provider, status: action.status, message };
  });

  return { provider, message, deliveries };
}

module.exports = { sendEmergencySms, buildAlertMessage };
