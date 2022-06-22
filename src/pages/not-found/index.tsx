export function NotFoundPage() {
  return (
    <div>
      We're sorry the page you requested was not found.
      <button type="button" onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
}
