const resources = [
  { name: 'Crisis Text Line', description: 'Text HOME to 741741 (US/Canada)', type: '24/7 Crisis Support' },
  { name: '988 Suicide & Crisis Lifeline', description: 'Dial 988 from any US phone line', type: 'Emergency' },
  { name: 'SAMHSA Helpline', description: '1-800-662-4357', type: 'Substance Use Support' },
  { name: 'Local Emergency Services', description: 'Dial your local emergency number', type: 'Immediate Assistance' },
];

export function EmergencyResources() {
  return (
    <div className="rounded-2xl border border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10 p-6">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-danger">Emergency Resources</p>
        <p className="text-sm text-slate-600">If you are in immediate danger, please contact your local emergency services or reach out to a trusted person.</p>
      </div>
      <ul className="space-y-4">
        {resources.map((resource) => (
          <li key={resource.name} className="rounded-lg border border-white/40 bg-white/70 p-4 shadow-sm">
            <p className="text-base font-semibold text-slate-900">{resource.name}</p>
            <p className="text-sm text-slate-600">{resource.description}</p>
            <p className="text-xs font-medium uppercase text-danger">{resource.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
