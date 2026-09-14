import type { Metadata } from "next";
import Container from "@/components/Container";
import { socialLinks } from "@/content/social-links";

export const metadata: Metadata = {
  title: "About — Daniel Sinensky",
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="max-w-xl">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border text-lg text-muted">
            DS
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-muted">
            <p>
              Hi, I&apos;m Daniel Sinensky, a cybersecurity professional who
              pairs hands-on security work with a track record of turning
              outreach into results. I also build the software and tooling I
              talk about, so when I talk security, I&apos;m not reading from
              a script.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
          <p>
            I hold an M.S. in Cybersecurity from the Katz School of Science
            and Health at Yeshiva University, where I served as Vice
            President of the ISACA Student Group, part of the ISACA New
            York Metropolitan Chapter. There, I built a recurring outreach
            pipeline to cybersecurity leaders (CISOs, VPs, analysts, GRC
            managers, and engineers), converting cold outreach into 5+
            speaking engagements a semester and growing member engagement
            50%, making our group the most active in the chapter.
          </p>
          <p>
            I&apos;m CompTIA Security+ certified, hold ISC2&apos;s Certified
            in Cybersecurity (CC) credential, and the Cloud Security
            Alliance&apos;s Certificate of Cloud Security Knowledge (CCSK).
            My hands-on experience spans incident response, IAM, risk
            analysis, GRC documentation (NIST, SOC 2, ISO 27001, HIPAA), and
            Splunk-based log analysis, backed by SOC training through
            Cyberbit&apos;s Yeshiva University SOC Lab Program and
            Google&apos;s Cybersecurity certificate coursework.
          </p>
          <p>
            On the builder side, my current project, Threat Intelligence Log
            Analyzer, is a Python and SQL tool that generates simulated
            enterprise log data, runs SQL-driven detection rules for things
            like brute-force attempts, privilege escalation, and lateral
            movement, and outputs a severity-ranked threat report. It&apos;s
            the SOC and detection work from my training, built as code.
          </p>
          <p>
            This site is where I collect that work: personal projects,
            client projects, and everything else I build or make.
          </p>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <h2 className="text-sm text-muted">Skills</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Certifications: CompTIA Security+ / ISC2 Certified in
            Cybersecurity / CSA CCSK
          </p>
          <p className="mt-1 text-sm leading-relaxed">
            Cybersecurity: SOC Analysis / Network Security / Incident
            Response / IAM / Risk Analysis / GRC (NIST, SOC 2, ISO 27001,
            HIPAA) / Splunk Log Analysis / Threat Detection
          </p>
          <p className="mt-1 text-sm leading-relaxed">
            IT &amp; Systems: VirtualBox / VLANs &amp; Firewalls / Microsoft
            365 / SharePoint / ServiceNow
          </p>
          <p className="mt-1 text-sm leading-relaxed">
            AV &amp; Event Production: Zoom / OBS / Audio Mixing / Livestream
            Support / Projectors &amp; Display Systems
          </p>
          <p className="mt-1 text-sm leading-relaxed">
            Software Engineering: Python / SQL / SQLite / Next.js /
            TypeScript
          </p>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <h2 className="text-sm text-muted">Contact</h2>
          <p className="mt-3 text-sm">
            Email:{" "}
            <a href="mailto:danielsinensky@danielsinensky.com" className="hover:underline">
              danielsinensky@danielsinensky.com
            </a>
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            {socialLinks.map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground"
              >
                <Icon size={16} />
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
