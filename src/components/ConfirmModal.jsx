export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ color: 'var(--accent-red)' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }}></i>{title}
          </h3>
          <button className="modal-close" onClick={onCancel}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm}><i className="fa-solid fa-trash"></i> Delete</button>
        </div>
      </div>
    </div>
  );
}
