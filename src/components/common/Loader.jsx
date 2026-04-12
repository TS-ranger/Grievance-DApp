export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader">
      <div className="loader__spinner" />
      <span>{text}</span>
    </div>
  );
}
