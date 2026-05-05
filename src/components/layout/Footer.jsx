export default function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-lg text-white mb-2">NMPB Project Portal</h3>
          <p className="text-sm text-forest-200/80">
            Centralised repository of medicinal plants research and development projects sanctioned by the National Medicinal Plants Board, Ministry of AYUSH, Government of India.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-3">Quick Links</h4>
          <ul className="text-sm space-y-1.5 text-forest-200/80">
            <li>About NMPB</li>
            <li>Schemes &amp; Guidelines</li>
            <li>Apply for Grant</li>
            <li>Contact &amp; Support</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-3">Disclaimer</h4>
          <p className="text-xs text-forest-300/70 leading-relaxed">
            This is a demonstration portal. Project data shown is illustrative. For official information visit the NMPB website.
          </p>
        </div>
      </div>
      <div className="border-t border-forest-800 py-4 text-center text-xs text-forest-400">
        © {new Date().getFullYear()} National Medicinal Plants Board • Ministry of AYUSH
      </div>
    </footer>
  );
}