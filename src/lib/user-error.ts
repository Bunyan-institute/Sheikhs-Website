/**
 * An error whose message is safe and useful to show to the admin (validation, conflicts).
 * Server actions turn these into returned results because Next.js hides thrown messages in production.
 */
export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}
