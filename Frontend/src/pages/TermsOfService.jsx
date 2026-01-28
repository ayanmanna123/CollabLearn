import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-gray-200 py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-indigo-400 transition"
          >
            ← Back to home
          </Link>
          <div className="mt-4 h-px bg-white/10" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="mt-4 text-gray-400">
            Please read these terms carefully before using Ment2Be.
          </p>
        </div>

        {/* Content */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8">

          <Section title="1. Acceptance of Terms">
            By accessing or using Ment2Be, you agree to be bound by these Terms of
            Service. If you do not agree, please do not use the platform.
          </Section>

          <Section title="2. Description of Service">
            Ment2Be is a mentorship platform that connects mentors and mentees.
            We do not guarantee outcomes, career success, or mentorship quality.
          </Section>

          <Section title="3. User Accounts">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities under your account.
          </Section>

          <Section title="4. Acceptable Use">
            Users must not:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Harass, abuse, or harm other users</li>
              <li>Misuse the platform for illegal or unethical purposes</li>
              <li>Attempt to access unauthorized areas of the platform</li>
            </ul>
          </Section>

          <Section title="5. Content & Intellectual Property">
            All platform content, branding, and features belong to Ment2Be.
            User-generated content remains owned by the user but may be used to
            operate and improve the service.
          </Section>

          <Section title="6. Termination">
            Ment2Be reserves the right to suspend or terminate accounts that
            violate these terms or misuse the platform.
          </Section>

          <Section title="7. Disclaimer">
            The service is provided “as is” without warranties of any kind.
            Ment2Be is not responsible for mentorship outcomes or user decisions.
          </Section>

          <Section title="8. Limitation of Liability">
            Ment2Be shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of the platform.
          </Section>

          <Section title="9. Changes to Terms">
            These Terms may be updated from time to time. Continued use of the
            platform constitutes acceptance of the revised terms.
          </Section>

          <Section title="10. Governing Law">
            These Terms shall be governed in accordance with applicable laws of
            the jurisdiction in which Ment2Be operates.
          </Section>

          <Section title="11. Contact">
            For any questions regarding these Terms of Service, please contact
            the Ment2Be team through official channels.
          </Section>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-10">
          © {new Date().getFullYear()} Ment2Be. All rights reserved.
        </p>

      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold text-white mb-3">
      {title}
    </h2>
    <div className="text-gray-300 leading-relaxed">
      {children}
    </div>
  </div>
);

export default TermsOfService;
