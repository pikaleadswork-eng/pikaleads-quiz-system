import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/pikaleads-logo.png" alt="PIKALEADS" className="w-8 h-8" />
            <span className="text-foreground font-semibold">PIKALEADS</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact Us
            </Link>
            <a 
              href="mailto:support@pikaleads.com" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              support@pikaleads.com
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PIKALEADS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
