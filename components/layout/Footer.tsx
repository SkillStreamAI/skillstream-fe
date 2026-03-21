export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-3)]">
      <p>
        © {new Date().getFullYear()} SkillStream AI — Built on AWS Bedrock &amp; Polly
      </p>
    </footer>
  );
}
