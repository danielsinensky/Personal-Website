import Container from "@/components/Container";
import EmailSignupForm from "@/components/EmailSignupForm";
import { socialLinks } from "@/content/social-links";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Daniel Sinensky</p>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Daniel Sinensky. All rights reserved.
          </p>
          <div className="mt-3 flex gap-4">
            {socialLinks.map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                className="text-muted transition-colors hover:text-foreground"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted">
            Get updates by email
          </p>
          <EmailSignupForm compact />
        </div>
      </Container>
    </footer>
  );
}
