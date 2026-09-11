export default function Toast({ message }) {
  return (
    <div className={`toast ${message ? 'visible' : 'hidden'}`}>
      {message}
    </div>
  )
}
