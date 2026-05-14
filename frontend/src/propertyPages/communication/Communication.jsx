import React, { useState } from 'react';

export default function Communication() {
  const [message, setMessage] = useState({ subject: '', body: '', recipients: 'all' });

  const handleSend = async (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setMessage({ subject: '', body: '', recipients: 'all' });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Communication & Notices</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Send Message</h2>
          <form onSubmit={handleSend}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Recipients</label>
              <select
                value={message.recipients}
                onChange={(e) => setMessage({...message, recipients: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="all">All Tenants</option>
                <option value="property">By Property</option>
                <option value="unit">By Unit</option>
                <option value="individual">Individual Tenant</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                value={message.subject}
                onChange={(e) => setMessage({...message, subject: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={message.body}
                onChange={(e) => setMessage({...message, body: e.target.value})}
                className="w-full border rounded px-3 py-2"
                rows="6"
                required
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Send SMS
              </button>
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                Send Email
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-yellow-500 text-white px-4 py-3 rounded hover:bg-yellow-600 text-left">
              Send Payment Reminder
            </button>
            <button className="w-full bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 text-left">
              Lease Renewal Notice
            </button>
            <button className="w-full bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 text-left">
              Maintenance Update
            </button>
            <button className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 text-left">
              General Announcement
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-3">Recent Messages</h3>
            <div className="space-y-2">
              <div className="border-l-4 border-blue-500 pl-3 py-2">
                <p className="font-medium">Payment Reminder</p>
                <p className="text-sm text-gray-600">Sent to 15 tenants - 2 hours ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3 py-2">
                <p className="font-medium">Maintenance Notice</p>
                <p className="text-sm text-gray-600">Sent to Building A - Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
