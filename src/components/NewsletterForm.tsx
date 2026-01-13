import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Mail, CheckCircle, Loader2 } from "./ui/Icons";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      setIsSubmitted(true);
      setEmail("");

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--color-cream)] rounded-2xl p-8 text-center">
      <div className="w-14 h-14 bg-[var(--color-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail className="w-7 h-7 text-[var(--color-teal)]" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Stay Updated
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Subscribe to our newsletter for the latest updates on our programs and impact.
      </p>

      {isSubmitted ? (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
          <CheckCircle className="w-5 h-5" />
          <span>Thank you for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="flex-1">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="text-center sm:text-left"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      <p className="text-xs text-gray-500 mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
