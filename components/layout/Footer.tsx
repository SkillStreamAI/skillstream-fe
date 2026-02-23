export function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] py-8 text-center text-sm text-[#52525b]">
      <p>
        © {new Date().getFullYear()} SkillStream AI — Built on AWS Bedrock &amp; Polly
      </p>
    </footer>
  );
}
