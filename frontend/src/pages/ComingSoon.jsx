export default function ComingSoon({ title }) {
  return (
    <div className="state-block state-empty">
      <div className="state-empty-title">{title} is being built next</div>
      <div>This page is part of the step-by-step build and isn't wired up yet.</div>
    </div>
  );
}
