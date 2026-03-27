import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-[hsl(0,0%,6.7%)] border-t border-primary/[0.08] py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="text-lg font-bold">
          <span className="text-primary">AI</span>{" "}
          <span className="text-foreground">Professor</span>
        </Link>

        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
          <span className="cursor-default">About</span>
          <span className="cursor-default">Privacy Policy</span>
          <span className="cursor-default">Terms</span>
        </div>

        <p className="text-sm text-muted-foreground">
          Built with ❤️ for students
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-primary/[0.06] text-center text-xs text-muted-foreground">
        © 2025 AI Professor. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
